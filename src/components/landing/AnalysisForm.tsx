import React, { useState } from 'react';
import { Target, MapPin, FileText, BarChart3, Building2, Clock, CheckCircle } from 'lucide-react';
import URLSelection from './URLSelection';
import ProgressTracker from './ProgressTracker';

interface AnalysisFormProps {
  isAnalyzing: boolean;
  currentPhase: 'discovering' | 'url-selection' | 'scraping' | 'analyzing' | 'completed';
  analysisLog: string[];
  error: string | null;
  scrapedContent: string;
  showScrapedContent: boolean;
  startAnalysis: (url: string) => Promise<void>;
  urlSelectionState?: any;
  showUrlSelection?: boolean;
  scrapeProgress?: any;
  analysisProgress?: any;
  handleUrlsSelected?: (selectedUrls: string[]) => void;
  handleBackToUrlSelection?: () => void;
  onAnalysisComplete?: (result: any) => void;
}

export default function AnalysisForm({ 
  isAnalyzing, 
  currentPhase, 
  analysisLog, 
  error, 
  scrapedContent,
  showScrapedContent,
  startAnalysis,
  urlSelectionState,
  showUrlSelection = false,
  scrapeProgress,
  analysisProgress,
  handleUrlsSelected,
  handleBackToUrlSelection
}: AnalysisFormProps) {
  const [url, setUrl] = useState('');

  const handleStartAnalysis = async () => {
    if (url) {
      await startAnalysis(url);
    }
  };

  return (
    <div className="space-y-6">
      {!isAnalyzing && !showUrlSelection ? (
        // Initial URL Input Form
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-3 text-sm uppercase tracking-wide">
              Enter your business website URL
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
                <span>Starting Analysis...</span>
              </>
            ) : (
              <>
                <Target className="h-6 w-6" />
                <span>Start Analysis</span>
              </>
            )}
          </button>
        </div>
      ) : showUrlSelection && urlSelectionState ? (
        // URL Selection Component
        <URLSelection
          urlSelectionState={urlSelectionState}
          onUrlsSelected={handleUrlsSelected || (() => {})}
          onBack={handleBackToUrlSelection || (() => {})}
          isLoading={isAnalyzing}
        />
      ) : (
        // Progress Tracker
        <ProgressTracker
          currentPhase={currentPhase}
          scrapeProgress={scrapeProgress}
          analysisProgress={analysisProgress}
          error={error}
        />
      )}

      {/* Analysis Log */}
      {isAnalyzing && analysisLog.length > 0 && (
        <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
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
        <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
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
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-500">
          <div className="flex items-center space-x-3 text-red-300">
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
} 