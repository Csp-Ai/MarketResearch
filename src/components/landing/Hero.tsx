import React, { useState } from 'react';
import { Target, MapPin, FileText, BarChart3, Building2, Clock, CheckCircle } from 'lucide-react';
import URLSelection from './URLSelection';
import ProgressTracker from './ProgressTracker';

interface HeroProps {
  isAnalyzing?: boolean;
  isDiscovering?: boolean;
  isUrlSelecting?: boolean;
  isScraping?: boolean;
  isAnalyzingPhase?: boolean;
  currentPhase?: 'discovering' | 'url-selection' | 'scraping' | 'analyzing' | 'completed';
  analysisLog?: string[];
  error?: string | null;
  scrapedContent?: string;
  showScrapedContent?: boolean;
  startAnalysis?: (url: string) => Promise<void>;
  urlSelectionState?: any;
  showUrlSelection?: boolean;
  scrapeProgress?: any;
  analysisProgress?: any;
  handleUrlsSelected?: (selectedUrls: string[]) => void;
  handleBackToUrlSelection?: () => void;
}

export default function Hero({ 
  isAnalyzing = false,
  isDiscovering = false,
  isUrlSelecting = false,
  isScraping = false,
  isAnalyzingPhase = false,
  currentPhase = 'discovering', 
  analysisLog = [], 
  error = null, 
  scrapedContent = '', 
  showScrapedContent = false, 
  startAnalysis,
  urlSelectionState,
  showUrlSelection = false,
  scrapeProgress,
  analysisProgress,
  handleUrlsSelected,
  handleBackToUrlSelection
}: HeroProps) {
  const [url, setUrl] = useState('');

  const handleStartAnalysis = async () => {
    if (url && startAnalysis) {
      await startAnalysis(url);
    }
  };

  return (
    <section className="pt-10 md:pt-20 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-800 via-dark-700 to-dark-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Hero Content */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-tight text-white">
              Is Your Business Reaching Its Full Potential?
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-300">
              Our AI‑driven market research uncovers hidden opportunities and provides a clear roadmap—so you know where to invest your time and resources for the best return to grow your business.
            </p>
          </div>
          
          {/* Analysis Form and Progress */}
          <div className="max-w-2xl mx-auto">
            {!isAnalyzing && !showUrlSelection ? (
              // Initial URL Input Form
              <div className="bg-dark-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-3 text-sm uppercase tracking-wide">
                      Get a free AI Agent Market Research Blueprint for your business website
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-dark-700 text-white font-medium transition-all duration-300 hover:border-gray-500 placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleStartAnalysis}
                    disabled={!url || isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-extrabold px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Agents Working...</span>
                      </>
                    ) : (
                      <>
                        <Target className="h-6 w-6" />
                        <span>Deploy Agent Team</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : showUrlSelection && urlSelectionState ? (
              // URL Selection Component
              <URLSelection
                urlSelectionState={urlSelectionState}
                onUrlsSelected={handleUrlsSelected || (() => {})}
                onBack={handleBackToUrlSelection || (() => {})}
                isLoading={isScraping}
              />
            ) : (
              // Progress Tracker
              <div className="bg-dark-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <ProgressTracker
                  currentPhase={currentPhase}
                  scrapeProgress={scrapeProgress}
                  analysisProgress={analysisProgress}
                  error={error}
                />
                
                {/* Analysis Log */}
                {isAnalyzing && analysisLog.length > 0 && (
                  <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 mt-6">
                    <div className="flex items-center space-x-3 text-gray-200 mb-3">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="font-semibold">Live Agent Feed</span>
                    </div>
                    <div className="bg-dark-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                      {analysisLog.map((logEntry, index) => (
                        <div key={index} className="text-green-300 text-sm font-mono mb-1">
                          {logEntry}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Scraped Content Display */}
                {isAnalyzing && showScrapedContent && scrapedContent && (
                  <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 mt-6">
                    <div className="flex items-center justify-between text-gray-200 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="font-semibold">Scraped Content ({scrapedContent.length.toLocaleString()} characters)</span>
                      </div>
                      <span className="text-xs text-gray-400">Live Updates</span>
                    </div>
                    <div className="bg-dark-800 rounded-lg p-3 max-h-64 overflow-y-auto">
                      <pre className="text-green-300 text-xs font-mono whitespace-pre-wrap select-all">
                        {scrapedContent}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 