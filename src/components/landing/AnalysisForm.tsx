import React, { useState } from 'react';
import { Target, ArrowRight } from 'lucide-react';

interface AnalysisFormProps {
  isAnalyzing: boolean;
  currentStep: string;
  analysisLog: string[];
  error: string | null;
  startAnalysis: (url: string) => Promise<void>;
  onAnalysisComplete?: (result: any) => void;
}

export default function AnalysisForm({ 
  isAnalyzing, 
  currentStep, 
  analysisLog, 
  error, 
  startAnalysis 
}: AnalysisFormProps) {
  const [url, setUrl] = useState('');

  const handleStartAnalysis = async () => {
    if (url) {
      await startAnalysis(url);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-2xl mb-12">
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-3 text-sm uppercase tracking-wide">
            Get a free AI Agent Market Research Blueprint for your business website
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300"
          />
        </div>
        <button
          onClick={handleStartAnalysis}
          disabled={!url || isAnalyzing}
          className="w-full bg-gradient-to-r from-sky-400 to-blue-300 text-[#102A43] font-extrabold px-8 py-4 rounded-xl hover:from-sky-500 hover:to-blue-400 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>
                {currentStep === 'discovering' ? 'Discovering URLs...' : 
                 currentStep === 'scraping' ? 'Scraping Pages...' : 
                 currentStep === 'combining' ? 'Combining Data...' : 
                 'Analyzing...'}
              </span>
            </>
          ) : (
            <>
              <Target className="h-6 w-6" />
              <span>Get My AI Agent Blueprint</span>
            </>
          )}
        </button>
      </div>
      
      {/* Step Progress Bar */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep === 'discovering' || isAnalyzing ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
              1
            </div>
            <span>Discover URLs</span>
          </div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep === 'scraping' ? 'bg-blue-500 text-white' : currentStep === 'combining' || (isAnalyzing && currentStep !== 'discovering') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              2
            </div>
            <span>Scrape Pages</span>
          </div>
          <ArrowRight className="h-4 w-4" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep === 'combining' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
              3
            </div>
            <span>Combine Data</span>
          </div>
        </div>
      </div>
      
      {/* Analysis Log and Error */}
      {isAnalyzing && analysisLog.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
          <div className="flex items-center space-x-3 text-gray-100 mb-3">
            <div className="animate-pulse flex space-x-1">
              <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="font-semibold">Analysis Progress</span>
          </div>
          <div className="bg-black/20 rounded-lg p-3 max-h-48 overflow-y-auto">
            {analysisLog.map((logEntry, index) => (
              <div key={index} className="text-green-100 text-sm font-mono mb-1">
                {logEntry}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-300">
          <div className="flex items-center space-x-3 text-red-100">
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
} 