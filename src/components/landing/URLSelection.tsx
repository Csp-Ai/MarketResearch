import React, { useState, useEffect } from 'react';
import { Check, Globe, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { URLSelectionState } from '../../types/analysis';

interface URLSelectionProps {
  urlSelectionState: URLSelectionState;
  onUrlsSelected: (selectedUrls: string[]) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function URLSelection({ 
  urlSelectionState, 
  onUrlsSelected, 
  onBack,
  isLoading = false 
}: URLSelectionProps) {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Initialize selected URLs with the original URL
  useEffect(() => {
    if (urlSelectionState.discoveredUrls.length > 0) {
      const originalUrl = urlSelectionState.baseUrl;
      setSelectedUrls([originalUrl]);
    }
  }, [urlSelectionState.discoveredUrls, urlSelectionState.baseUrl]);

  // Update select all state
  useEffect(() => {
    setSelectAll(selectedUrls.length === urlSelectionState.discoveredUrls.length);
  }, [selectedUrls, urlSelectionState.discoveredUrls]);

  const handleUrlToggle = (url: string) => {
    setSelectedUrls(prev => 
      prev.includes(url) 
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUrls([]);
    } else {
      setSelectedUrls(urlSelectionState.discoveredUrls);
    }
  };

  const handleStartScraping = () => {
    if (selectedUrls.length > 0) {
      onUrlsSelected(selectedUrls);
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getPathFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-dark-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            🕷️ URL Discovery Complete
          </h3>
          <p className="text-gray-300">
            We found {urlSelectionState.discoveredUrls.length} pages on your website. 
            Select which ones to analyze:
          </p>
        </div>

        {/* Robots.txt Info */}
        <div className={`p-4 rounded-lg border ${
          urlSelectionState.allowedByRobots 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}>
          <div className="flex items-center space-x-3">
            {urlSelectionState.allowedByRobots ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            )}
            <div>
              <p className={`font-medium ${
                urlSelectionState.allowedByRobots ? 'text-green-300' : 'text-yellow-300'
              }`}>
                {urlSelectionState.allowedByRobots 
                  ? 'Robots.txt allows crawling' 
                  : 'Robots.txt restrictions detected'
                }
              </p>
              {urlSelectionState.crawlDelay > 0 && (
                <p className="text-gray-400 text-sm flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Crawl delay: {urlSelectionState.crawlDelay}s between requests
                </p>
              )}
            </div>
          </div>
        </div>

        {/* URL List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">
              Discovered Pages ({urlSelectionState.discoveredUrls.length})
            </h4>
            <button
              onClick={handleSelectAll}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {urlSelectionState.discoveredUrls.map((url, index) => {
              const isSelected = selectedUrls.includes(url);
              const isOriginal = url === urlSelectionState.baseUrl;
              
              return (
                <div
                  key={url}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleUrlToggle(url)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-400'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isSelected ? 'text-white' : 'text-gray-300'
                          }`}>
                            {getDomainFromUrl(url)}
                          </p>
                          <p className={`text-xs truncate ${
                            isSelected ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {getPathFromUrl(url)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {isOriginal && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Original
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                {selectedUrls.length} of {urlSelectionState.discoveredUrls.length} pages selected
              </p>
              <p className="text-gray-400 text-sm">
                Estimated analysis time: {Math.ceil(selectedUrls.length * 0.5)} minutes
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-medium">
                {Math.round((selectedUrls.length / urlSelectionState.discoveredUrls.length) * 100)}% coverage
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleStartScraping}
            disabled={selectedUrls.length === 0 || isLoading}
            className={`flex-1 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedUrls.length > 0 && !isLoading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span>Start Scraping</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 