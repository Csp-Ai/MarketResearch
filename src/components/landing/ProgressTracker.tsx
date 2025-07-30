import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { ScrapeStatusResponse, AnalysisStatusResponse } from '../../types/analysis';

interface ProgressTrackerProps {
  currentPhase: 'discovering' | 'url-selection' | 'scraping' | 'analyzing' | 'completed';
  scrapeProgress?: ScrapeStatusResponse;
  analysisProgress?: AnalysisStatusResponse;
  error?: string | null;
}

export default function ProgressTracker({
  currentPhase,
  scrapeProgress,
  analysisProgress,
  error
}: ProgressTrackerProps) {
  const getPhaseStatus = (phase: string) => {
    if (error) return 'error';
    if (currentPhase === phase) return 'active';
    if (currentPhase === 'completed' || 
        (currentPhase === 'analyzing' && ['discovering', 'url-selection', 'scraping'].includes(phase)) ||
        (currentPhase === 'scraping' && ['discovering', 'url-selection'].includes(phase)) ||
        (currentPhase === 'url-selection' && phase === 'discovering')) {
      return 'completed';
    }
    return 'pending';
  };

  const getProgressPercentage = () => {
    const phases = ['discovering', 'url-selection', 'scraping', 'analyzing'];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex === -1) return 100; // completed
    return Math.round(((currentIndex + 1) / phases.length) * 100);
  };

  const getPhaseProgress = () => {
    if (currentPhase === 'scraping' && scrapeProgress) {
      return scrapeProgress.progress;
    }
    if (currentPhase === 'analyzing' && analysisProgress) {
      return analysisProgress.progress;
    }
    return 0;
  };

  const getCurrentStatusText = () => {
    switch (currentPhase) {
      case 'discovering':
        return 'URL Scout Agent is mapping your digital territory...';
      case 'url-selection':
        return 'Please select which pages to analyze...';
      case 'scraping':
        return scrapeProgress 
          ? `Content Miner Agent is extracting insights... (${scrapeProgress.scraped_count}/${scrapeProgress.total_urls})`
          : 'Content Miner Agent is extracting valuable insights...';
      case 'analyzing':
        return analysisProgress
          ? `Strategy Builder Agent is creating your blueprint... (${analysisProgress.progress}%)`
          : 'Strategy Builder Agent is creating your blueprint...';
      case 'completed':
        return 'Analysis completed successfully!';
      default:
        return 'Ready to deploy our agent team';
    }
  };

  const phases = [
    {
      id: 'discovering',
      name: 'Step One: Discover Your Website',
      description: 'Our URL Scout Agent explores your entire website to find every important page.',
      icon: '🔍'
    },
    {
      id: 'url-selection',
      name: 'Step Two: Select Pages to Analyze',
      description: 'Choose which pages contain the most valuable information for your analysis.',
      icon: '📋'
    },
    {
      id: 'scraping',
      name: 'Step Three: Extract Insights',
      description: 'Our Content Miner Agent reads and analyzes all your content for valuable information.',
      icon: '📄'
    },
    {
      id: 'analyzing',
      name: 'Step Four: Build Your Blueprint',
      description: 'Our Strategy Builder Agent creates your personalized AI Agent Blueprint.',
      icon: '🏗️'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">🤖 Agent Mission Progress</h3>
        <p className="text-gray-300 text-sm mb-3">
          {getCurrentStatusText()}
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400 text-sm">{getProgressPercentage()}% Complete</span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>
        
        {/* Timeline Steps */}
        <div className="space-y-6">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            const isLast = index === phases.length - 1;
            
            return (
              <div key={phase.id} className="relative flex items-start">
                {/* Timeline Node */}
                <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  status === 'completed' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                    : status === 'active'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg animate-pulse'
                    : status === 'error'
                    ? 'bg-red-500 shadow-lg'
                    : 'bg-gray-600 border-2 border-gray-500'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : status === 'active' ? (
                    <Loader className="h-5 w-5 text-white animate-spin" />
                  ) : status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-white text-lg">{phase.icon}</span>
                  )}
                </div>
                
                {/* Content Card */}
                <div className={`ml-16 flex-1 p-4 rounded-lg border transition-all duration-300 ${
                  status === 'completed' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : status === 'active'
                    ? 'bg-blue-500/10 border-blue-500/30 animate-pulse'
                    : status === 'error'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-gray-700/50 border-gray-600'
                }`}>
                  <h4 className={`font-semibold text-lg mb-2 ${
                    status === 'completed' || status === 'active' 
                      ? 'text-white' 
                      : status === 'error'
                      ? 'text-red-300'
                      : 'text-gray-400'
                  }`}>
                    {phase.name}
                  </h4>
                  <p className={`text-sm ${
                    status === 'completed' || status === 'active' 
                      ? 'text-gray-300' 
                      : status === 'error'
                      ? 'text-red-200'
                      : 'text-gray-500'
                  }`}>
                    {phase.description}
                  </p>
                  
                  {/* Phase-specific progress */}
                  {status === 'active' && currentPhase === 'scraping' && scrapeProgress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Scraping Progress</span>
                        <span>{scrapeProgress.scraped_count}/{scrapeProgress.total_urls}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scrapeProgress.progress}%` }}
                        ></div>
                      </div>
                      {scrapeProgress.failed_count > 0 && (
                        <p className="text-yellow-400 text-xs mt-1">
                          {scrapeProgress.failed_count} failed, {scrapeProgress.remaining_count} remaining
                        </p>
                      )}
                    </div>
                  )}
                  
                  {status === 'active' && currentPhase === 'analyzing' && analysisProgress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Analysis Progress</span>
                        <span>{analysisProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analysisProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : status === 'active'
                        ? 'bg-blue-500 text-white'
                        : status === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {status === 'completed' ? '✅ Complete' : 
                       status === 'active' ? '🔄 Working Now' : 
                       status === 'error' ? '❌ Error' :
                       '⏳ Waiting'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-500">
          <div className="flex items-center space-x-3 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
} 