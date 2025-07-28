import { useState } from 'react';
import { ScrapingResult, AnalysisReport } from '../types/analysis';

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null);
  const [scrapedContent, setScrapedContent] = useState<string>('');
  const [showScrapedContent, setShowScrapedContent] = useState(false);

  const addLogEntry = (message: string) => {
    setAnalysisLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const addScrapedContent = (content: string, url: string, title: string) => {
    const newContent = `=== ${title} (${url}) ===\n${content}\n\n`;
    setScrapedContent(prev => prev + newContent);
  };

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

  const startAnalysis = async (url: string) => {
    if (!url) return;
    
    setIsAnalyzing(true);
    setAnalysisLog([]);
    setCurrentStep('');
    setError(null);
    setScrapingResult(null);
    setScrapedContent('');
    setShowScrapedContent(true);
    
    try {
      const apiBaseUrl = import.meta.env.VITE_SCRAPER_API_BASE_URL || 'http://localhost:8000';
      
      // Step 1: Discover crawlable URLs
      setCurrentStep('discovering');
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

      const discoverData = await discoverResponse.json();
      addLogEntry(`✅ Found ${discoverData.urls?.length || 0} crawlable URLs`);
      
      if (!discoverData.urls || discoverData.urls.length === 0) {
        throw new Error('No crawlable URLs found');
      }

      // Step 2: Scrape each URL, starting with the original URL
      setCurrentStep('scraping');
      const allScrapedData = [];
      
      // Ensure the original URL is included and scraped first
      const urlsToScrape = [url, ...discoverData.urls.filter((u: string) => u !== url)];
      addLogEntry(`📋 Will scrape ${urlsToScrape.length} URLs (starting with original URL)`);
      
      for (let i = 0; i < urlsToScrape.length; i++) {
        const currentUrl = urlsToScrape[i];
        const isOriginal = currentUrl === url;
        addLogEntry(`🌐 Scraping URL ${i + 1}/${urlsToScrape.length}${isOriginal ? ' (ORIGINAL)' : ''}: ${currentUrl}`);
        
        try {
          const scrapeResponse = await fetch(`${apiBaseUrl}/scrape`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: currentUrl }),
          });

          if (!scrapeResponse.ok) {
            addLogEntry(`⚠️ Failed to scrape ${currentUrl}: HTTP ${scrapeResponse.status}`);
            continue;
          }

          const scrapeData = await scrapeResponse.json();
          // Remove all double quotes from title and content as soon as data is returned
          if (scrapeData.main_page) {
            if (typeof scrapeData.main_page.title === 'string') {
              scrapeData.main_page.title = scrapeData.main_page.title.replace(/"/g, '');
            }
            if (typeof scrapeData.main_page.content === 'string') {
              scrapeData.main_page.content = scrapeData.main_page.content.replace(/"/g, '');
            }
          }
          allScrapedData.push({
            url: currentUrl,
            data: scrapeData,
            isOriginal: isOriginal
          });
          
          // Add scraped content to display
          addScrapedContent(
            scrapeData.main_page?.content || '',
            currentUrl,
            scrapeData.main_page?.title || 'No Title'
          );
          
          addLogEntry(`✅ Successfully scraped: ${currentUrl}${isOriginal ? ' (ORIGINAL)' : ''}`);
          
        } catch (scrapeError) {
          addLogEntry(`❌ Error scraping ${currentUrl}: ${scrapeError instanceof Error ? scrapeError.message : 'Unknown error'}`);
        }
      }

      // Combine all scraped data
      setCurrentStep('combining');
      addLogEntry('🔗 Combining all scraped data...');
      
      // Aggregate all content from scraped pages, quotes already removed
      const allContent = allScrapedData.map(item => ({
        url: item.url,
        title: item.data.main_page?.title || 'No Title',
        content: item.data.main_page?.content || '',
        status: item.data.main_page?.status_code || 'N/A',
        isOriginal: item.isOriginal
      }));
      
      // Combine all text content for analysis (quotes already removed)
      const combinedTextContent = allContent
        .map(item => `=== ${item.title} (${item.url}) ===\n${item.content}`)
        .join('\n\n');
      
      // Extract key information for market research
      const extractedInfo = {
        total_pages: allContent.length,
        total_words: combinedTextContent.split(/\s+/).length,
        unique_products: extractProducts(combinedTextContent),
        contact_info: extractContactInfo(combinedTextContent),
        pricing_info: extractPricingInfo(combinedTextContent),
        business_description: extractBusinessDescription(combinedTextContent),
        key_features: extractKeyFeatures(combinedTextContent)
      };
      
      const combinedResult = {
        original_url: url,
        total_urls_discovered: discoverData.urls.length,
        total_urls_scraped: allScrapedData.length,
        scrape_time: Date.now(),
        all_scraped_data: allScrapedData,
        all_content: allContent,
        combined_text_content: combinedTextContent,
        extracted_info: extractedInfo,
        main_page: allScrapedData.find(data => data.url === url)?.data?.main_page || null,
        linked_pages: allScrapedData.flatMap(data => data.data.linked_pages || []),
        total_pages_scraped: allScrapedData.reduce((total, data) => total + (data.data.total_pages_scraped || 1), 0),
        unique_urls_visited: new Set(allScrapedData.flatMap(data => [data.url, ...(data.data.linked_pages?.map((p: any) => p.url) || [])])).size
      };

      // Send to /analyze-business endpoint
      setCurrentStep('analyzing');
      setShowScrapedContent(false); // Minimize scraped content during analysis
      addLogEntry('🤖 Sending combined data to AI for business analysis...');
      // Remove all double quotes from the combined content
      let cleanedContent = combinedTextContent.replace(/"/g, '');
      let analysisReport: AnalysisReport = {
        company_overview: '',
        key_offerings_or_products: [],
        target_customer_segments: [],
        unique_selling_points: [],
        industry_and_market_trends: [],
        potential_business_challenges: [],
        opportunities_for_using_ai: [],
        recommended_ai_use_cases: { short_term: [], medium_term: [], long_term: [] },
        data_requirements_and_risks: [],
        suggested_next_steps_for_ai_adoption: [],
        customer_journey_mapping: '',
        digital_maturity_assessment: '',
        technology_stack_overview: [],
        partnerships_and_alliances: [],
        sustainability_and_social_responsibility: '',
        financial_overview: '',
        actionable_recommendations: [],
        competitive_landscape: [],
        customer_testimonials: [],
        quantitative_opportunity_metrics: [],
        content_inventory: [],
        ai_maturity_level: '',
        data_sources_reviewed: [],
        business_stage: '',
        branding_tone: '',
        visual_opportunities: [],
        team_ai_readiness: ''
      };
      
      try {
        const analyzeResponse = await fetch(`${apiBaseUrl}/analyze-business`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ combined_content: cleanedContent })
        });
        
        let analyzeJson = null;
        try {
          analyzeJson = await analyzeResponse.json();
        } catch (jsonErr) {
          // Not valid JSON
        }
        
        if (analyzeJson && typeof analyzeJson === 'object') {
          analysisReport = {
            company_overview: analyzeJson.company_overview || '',
            key_offerings_or_products: analyzeJson.key_offerings_or_products || [],
            target_customer_segments: analyzeJson.target_customer_segments || [],
            unique_selling_points: analyzeJson.unique_selling_points || [],
            industry_and_market_trends: analyzeJson.industry_and_market_trends || [],
            potential_business_challenges: analyzeJson.potential_business_challenges || [],
            opportunities_for_using_ai: analyzeJson.opportunities_for_using_ai || [],
            recommended_ai_use_cases: analyzeJson.recommended_ai_use_cases || { short_term: [], medium_term: [], long_term: [] },
            data_requirements_and_risks: analyzeJson.data_requirements_and_risks || [],
            suggested_next_steps_for_ai_adoption: analyzeJson.suggested_next_steps_for_ai_adoption || [],
            customer_journey_mapping: analyzeJson.customer_journey_mapping || '',
            digital_maturity_assessment: analyzeJson.digital_maturity_assessment || '',
            technology_stack_overview: analyzeJson.technology_stack_overview || [],
            partnerships_and_alliances: analyzeJson.partnerships_and_alliances || [],
            sustainability_and_social_responsibility: analyzeJson.sustainability_and_social_responsibility || '',
            financial_overview: analyzeJson.financial_overview || '',
            actionable_recommendations: analyzeJson.actionable_recommendations || [],
            competitive_landscape: analyzeJson.competitive_landscape || [],
            customer_testimonials: analyzeJson.customer_testimonials || [],
            quantitative_opportunity_metrics: analyzeJson.quantitative_opportunity_metrics || [],
            content_inventory: analyzeJson.content_inventory || [],
            ai_maturity_level: analyzeJson.ai_maturity_level || '',
            data_sources_reviewed: analyzeJson.data_sources_reviewed || [],
            business_stage: analyzeJson.business_stage || '',
            branding_tone: analyzeJson.branding_tone || '',
            visual_opportunities: analyzeJson.visual_opportunities || [],
            team_ai_readiness: analyzeJson.team_ai_readiness || ''
          };
        } else {
          // fallback: try to get text for business_summary only
          let analyzeText = '';
          try {
            analyzeText = await analyzeResponse.text();
          } catch {}
          analysisReport = {
            company_overview: analyzeText,
            key_offerings_or_products: [],
            target_customer_segments: [],
            unique_selling_points: [],
            industry_and_market_trends: [],
            potential_business_challenges: [],
            opportunities_for_using_ai: [],
            recommended_ai_use_cases: { short_term: [], medium_term: [], long_term: [] },
            data_requirements_and_risks: [],
            suggested_next_steps_for_ai_adoption: [],
            customer_journey_mapping: '',
            digital_maturity_assessment: '',
            technology_stack_overview: [],
            partnerships_and_alliances: [],
            sustainability_and_social_responsibility: '',
            financial_overview: '',
            actionable_recommendations: [],
            competitive_landscape: [],
            customer_testimonials: [],
            quantitative_opportunity_metrics: [],
            content_inventory: [],
            ai_maturity_level: '',
            data_sources_reviewed: [],
            business_stage: '',
            branding_tone: '',
            visual_opportunities: [],
            team_ai_readiness: ''
          };
        }
      } catch (analyzeError) {
        addLogEntry('❌ Error analyzing business: ' + (analyzeError instanceof Error ? analyzeError.message : 'Unknown error'));
      }
      
      addLogEntry('🎉 Analysis completed successfully!');
      setScrapingResult({ ...combinedResult, combined_text_content: cleanedContent, analysisReport });
      
    } catch (error) {
      console.error('Error during analysis:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during analysis';
      addLogEntry(`❌ Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setCurrentStep('');
    }
  };

  return {
    isAnalyzing,
    currentStep,
    analysisLog,
    error,
    scrapingResult,
    scrapedContent,
    showScrapedContent,
    startAnalysis,
    addLogEntry
  };
}; 