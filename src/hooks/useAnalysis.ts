import { useState, useCallback, useRef } from 'react';
import { 
  ScrapingResult, 
  AnalysisReport, 
  DiscoverResponse, 
  ScrapeStatusResponse, 
  AnalysisStatusResponse,
  URLSelectionState 
} from '../types/analysis';

export const useAnalysis = () => {
  // Separate state for each step
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isUrlSelecting, setIsUrlSelecting] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Helper function to get overall loading state (for backward compatibility)
  const isAnyStepActive = isDiscovering || isUrlSelecting || isScraping || isAnalyzing;
  
  const [currentPhase, setCurrentPhase] = useState<'discovering' | 'url-selection' | 'scraping' | 'analyzing' | 'completed'>('discovering');
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null);
  const [scrapedContent, setScrapedContent] = useState<string>('');
  const [showScrapedContent, setShowScrapedContent] = useState(false);

  // New state for URL selection and polling
  const [urlSelectionState, setUrlSelectionState] = useState<URLSelectionState | null>(null);
  const [showUrlSelection, setShowUrlSelection] = useState(false);
  const [crawlId, setCrawlId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [scrapeProgress, setScrapeProgress] = useState<ScrapeStatusResponse | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisStatusResponse | null>(null);

  // Refs for polling intervals
  const scrapePollingRef = useRef<NodeJS.Timeout | null>(null);
  const analysisPollingRef = useRef<NodeJS.Timeout | null>(null);

  const addLogEntry = useCallback((message: string) => {
    setAnalysisLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const addScrapedContent = useCallback((content: string, url: string, title: string) => {
    const newContent = `=== ${title} (${url}) ===\n${content}\n\n`;
    setScrapedContent(prev => prev + newContent);
  }, []);

  // Helper functions to extract information from scraped content
  const extractProducts = (content: string): string[] => {
    const productMatches = content.match(/(?:product|item|service)[^.]*(?:name|title)[^.]*[:=]\s*([^.\n]+)/gi) || [];
    const priceMatches = content.match(/\$[\d,]+(?:\.\d{2})?/g) || [];
    return [...new Set([...productMatches, ...priceMatches])];
  };

  const extractContactInfo = (content: string): string[] => {
    const emailMatches = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
    const phoneMatches = content.match(/(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})/g) || [];
    const addressMatches = content.match(/(?:address|location)[^.]*[:=]\s*([^.\n]+)/gi) || [];
    return [...new Set([...emailMatches, ...phoneMatches, ...addressMatches])];
  };

  const extractPricingInfo = (content: string): string[] => {
    const priceMatches = content.match(/\$[\d,]+(?:\.\d{2})?/g) || [];
    const currencyMatches = content.match(/(?:price|cost|fee)[^.]*[:=]\s*([^.\n]+)/gi) || [];
    return [...new Set([...priceMatches, ...currencyMatches])];
  };

  const extractBusinessDescription = (content: string): string => {
    const descriptionMatches = content.match(/(?:about|mission|description|we are)[^.]*[:=]\s*([^.\n]+)/gi) || [];
    return descriptionMatches.length > 0 ? (descriptionMatches[0] || 'No business description found') : 'No business description found';
  };

  const extractKeyFeatures = (content: string): string[] => {
    const featureMatches = content.match(/(?:feature|benefit|advantage|offering)[^.]*[:=]\s*([^.\n]+)/gi) || [];
    const technologyMatches = content.match(/(?:technology|platform|tool|software)[^.]*[:=]\s*([^.\n]+)/gi) || [];
    return [...new Set([...featureMatches, ...technologyMatches])];
  };

  // Polling functions
  const pollScrapeStatus = useCallback(async (crawlId: string) => {
    const apiBaseUrl = import.meta.env.VITE_SCRAPER_API_BASE_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${apiBaseUrl}/check-scrape-status/${crawlId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const statusData: ScrapeStatusResponse = await response.json();
      setScrapeProgress(statusData);
      
      addLogEntry(`📊 Scraping progress: ${statusData.scraped_count}/${statusData.total_urls} URLs completed (${statusData.progress}%)`);
      
      if (statusData.status === 'completed') {
        addLogEntry('✅ Scraping completed successfully!');
        setIsScraping(false);
        setIsAnalyzing(true);
        setCurrentPhase('analyzing');
        return true;
      } else if (statusData.status === 'failed') {
        throw new Error('Scraping failed');
      }
      
      return false;
    } catch (error) {
      addLogEntry(`❌ Error checking scrape status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }, [addLogEntry]);

  const pollAnalysisStatus = useCallback(async (analysisId: string) => {
    const apiBaseUrl = import.meta.env.VITE_SCRAPER_API_BASE_URL || 'http://localhost:8000';
    
    try {
      addLogEntry(`🔍 Checking analysis status for ID: ${analysisId}`);
      const response = await fetch(`${apiBaseUrl}/check-analysis/${analysisId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const statusData: AnalysisStatusResponse = await response.json();
      setAnalysisProgress(statusData);
      
      addLogEntry(`🧠 Analysis progress: ${statusData.progress}% complete (Status: ${statusData.status})`);
      
      if (statusData.status === 'completed' && statusData.result) {
        addLogEntry('✅ Analysis completed successfully!');
        
        // Create final result
        const finalResult: ScrapingResult = {
          original_url: urlSelectionState?.baseUrl || '',
          total_urls_discovered: urlSelectionState?.discoveredUrls.length || 0,
          total_urls_scraped: scrapeProgress?.scraped_count || 0,
          scrape_time: Date.now(),
          all_scraped_data: [], // Will be populated by backend
          all_content: [], // Will be populated by backend
          combined_text_content: '', // Will be populated by backend
          extracted_info: {
            total_pages: scrapeProgress?.total_urls || 0,
            total_words: 0, // Will be calculated
            unique_products: [],
            contact_info: [],
            pricing_info: [],
            business_description: '',
            key_features: []
          },
          main_page: null,
          linked_pages: [],
          total_pages_scraped: scrapeProgress?.scraped_count || 0,
          unique_urls_visited: scrapeProgress?.scraped_count || 0,
          analysisReport: statusData.result
        };
        
        setScrapingResult(finalResult);
        setIsAnalyzing(false);
        setCurrentPhase('completed');
        return true;
      } else if (statusData.status === 'failed') {
        throw new Error(statusData.error || 'Analysis failed');
      }
      
      return false;
    } catch (error) {
      addLogEntry(`❌ Error checking analysis status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }, [addLogEntry, urlSelectionState, scrapeProgress]);

  // Start polling for analysis status
  const startAnalysisPolling = useCallback((analysisId: string) => {
    const poll = async () => {
      try {
        const isComplete = await pollAnalysisStatus(analysisId);
        if (!isComplete) {
          analysisPollingRef.current = setTimeout(poll, 3000); // Poll every 3 seconds
        } else {
          setIsAnalyzing(false);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Analysis failed');
        setIsAnalyzing(false);
      }
    };
    
    poll();
  }, [pollAnalysisStatus]);

  // Start polling for scrape status
  const startScrapePolling = useCallback((crawlId: string) => {
    const poll = async () => {
      try {
        const isComplete = await pollScrapeStatus(crawlId);
        if (!isComplete) {
          scrapePollingRef.current = setTimeout(poll, 3000); // Poll every 3 seconds
        } else {
          // Start analysis
          addLogEntry('🔄 Scraping complete, starting analysis phase...');
          // We'll call startAnalysis directly here instead of using the callback
          if (!crawlId) {
            addLogEntry(`❌ Error: No crawl ID available for analysis`);
            return;
          }
          
          const apiBaseUrl = import.meta.env.VITE_SCRAPER_API_BASE_URL || 'http://localhost:8000';
          
          try {
            addLogEntry('🤖 Starting business analysis...');
            addLogEntry(`📋 Using crawl ID: ${crawlId}`);
            
            const response = await fetch(`${apiBaseUrl}/analyze-scraped-data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ crawl_id: crawlId }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAnalysisId(data.analysis_id);
            
            addLogEntry(`📋 Analysis started with ID: ${data.analysis_id}`);
            
            // Start polling for analysis status
            startAnalysisPolling(data.analysis_id);
            
          } catch (error) {
            addLogEntry(`❌ Error starting analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setError(error instanceof Error ? error.message : 'Failed to start analysis');
            setIsAnalyzing(false);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Scraping failed');
        setIsScraping(false);
      }
    };
    
    poll();
  }, [pollScrapeStatus, addLogEntry, startAnalysisPolling]);



  // Start scraping with selected URLs
  const startScraping = useCallback(async (selectedUrls: string[]) => {
    if (!urlSelectionState) return;
    
    const apiBaseUrl = import.meta.env.VITE_SCRAPER_API_BASE_URL || 'http://localhost:8000';
    
    try {
      setCurrentPhase('scraping');
      addLogEntry(`🚀 Starting scraping for ${selectedUrls.length} URLs...`);
      
      const response = await fetch(`${apiBaseUrl}/scrape-urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls: selectedUrls, 
          base_url: urlSelectionState.baseUrl 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCrawlId(data.crawl_id);
      
      addLogEntry(`📋 Scraping started with crawl ID: ${data.crawl_id}`);
      
      // Start polling for scrape status
      startScrapePolling(data.crawl_id);
      
    } catch (error) {
      addLogEntry(`❌ Error starting scraping: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setError(error instanceof Error ? error.message : 'Failed to start scraping');
      setIsScraping(false);
    }
  }, [urlSelectionState, addLogEntry, startScrapePolling]);

  // Main analysis function
  const startAnalysisProcess = useCallback(async (url: string) => {
    if (!url) return;
    
    // Step 1: Start discovering
    setIsDiscovering(true);
    setIsUrlSelecting(false);
    setIsScraping(false);
    setIsAnalyzing(false);
    
    setAnalysisLog([]);
    setCurrentPhase('discovering');
    setError(null);
    setScrapingResult(null);
    setScrapedContent('');
    setShowScrapedContent(true);
    setUrlSelectionState(null);
    setShowUrlSelection(false);
    setCrawlId(null);
    setAnalysisId(null);
    setScrapeProgress(null);
    setAnalysisProgress(null);
    
    // Clear any existing polling
    if (scrapePollingRef.current) {
      clearTimeout(scrapePollingRef.current);
    }
    if (analysisPollingRef.current) {
      clearTimeout(analysisPollingRef.current);
    }
    
    try {
      const apiBaseUrl = import.meta.env.VITE_SCRAPER_API_BASE_URL || 'http://localhost:8000';
      
      // Step 1: Discover crawlable URLs
      addLogEntry('🔍 Starting analysis...');
      addLogEntry(`📡 Discovering crawlable URLs for: ${url}`);
      
      const discoverResponse = await fetch(`${apiBaseUrl}/discover-crawlable-urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!discoverResponse.ok) {
        throw new Error(`HTTP error! status: ${discoverResponse.status}`);
      }

      const discoverData: DiscoverResponse = await discoverResponse.json();
      addLogEntry(`✅ Found ${discoverData.urls?.length || 0} crawlable URLs`);
      
      if (!discoverData.urls || discoverData.urls.length === 0) {
        throw new Error('No crawlable URLs found');
      }

      // Step 2: Switch to URL selection mode
      setIsDiscovering(false);
      setIsUrlSelecting(true);
      
      const urlSelectionState: URLSelectionState = {
        discoveredUrls: discoverData.urls,
        selectedUrls: [url], // Default to original URL
        baseUrl: discoverData.base_url,
        allowedByRobots: discoverData.allowed_by_robots,
        crawlDelay: discoverData.crawl_delay
      };
      
      setUrlSelectionState(urlSelectionState);
      setShowUrlSelection(true);
      setCurrentPhase('url-selection');
      
    } catch (error) {
      console.error('Error during analysis:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during analysis';
      addLogEntry(`❌ Error: ${errorMessage}`);
      setError(errorMessage);
      setIsDiscovering(false);
    }
  }, [addLogEntry]);

  // Handle URL selection
  const handleUrlsSelected = useCallback((selectedUrls: string[]) => {
    if (!urlSelectionState) return;
    
    // Step 3: Start scraping
    setIsUrlSelecting(false);
    setIsScraping(true);
    
    setShowUrlSelection(false);
    startScraping(selectedUrls);
  }, [urlSelectionState, startScraping]);

  // Handle back to URL selection
  const handleBackToUrlSelection = useCallback(() => {
    setShowUrlSelection(true);
    setIsUrlSelecting(true);
    setIsScraping(false);
    setIsAnalyzing(false);
    setCurrentPhase('url-selection');
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (scrapePollingRef.current) {
      clearTimeout(scrapePollingRef.current);
    }
    if (analysisPollingRef.current) {
      clearTimeout(analysisPollingRef.current);
    }
  }, []);

  return {
    isAnalyzing: isAnyStepActive, // For backward compatibility
    isDiscovering,
    isUrlSelecting,
    isScraping,
    isAnalyzingPhase: isAnalyzing, // The specific analyzing state
    currentPhase,
    analysisLog,
    error,
    scrapingResult,
    scrapedContent,
    showScrapedContent,
    urlSelectionState,
    showUrlSelection,
    scrapeProgress,
    analysisProgress,
    startAnalysis: startAnalysisProcess,
    handleUrlsSelected,
    handleBackToUrlSelection,
    addLogEntry,
    cleanup
  };
}; 