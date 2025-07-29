import React, { useState } from 'react';
import { Target, MapPin, FileText, BarChart3, Building2, Clock, CheckCircle } from 'lucide-react';

interface HeroProps {
  isAnalyzing?: boolean;
  currentStep?: string;
  analysisLog?: string[];
  error?: string | null;
  scrapedContent?: string;
  showScrapedContent?: boolean;
  startAnalysis?: (url: string) => Promise<void>;
}

export default function Hero({ 
  isAnalyzing = false, 
  currentStep = '', 
  analysisLog = [], 
  error = null, 
  scrapedContent = '', 
  showScrapedContent = false, 
  startAnalysis 
}: HeroProps) {
  const [url, setUrl] = useState('');

  const handleStartAnalysis = async () => {
    if (url && startAnalysis) {
      await startAnalysis(url);
    }
  };

  const getCurrentStatusText = () => {
    switch (currentStep) {
      case 'discovering':
        return 'URL Scout Agent is mapping your digital territory...';
      case 'scraping':
        return 'Content Miner Agent is extracting valuable insights...';
      case 'combining':
        return 'Data Analyst Agent is combining insights into strategy...';
      case 'analyzing':
        return 'Strategy Builder Agent is creating your blueprint...';
      default:
        return 'Ready to deploy our agent team';
    }
  };

  const getStepStatus = (step: string) => {
    if (!isAnalyzing) return 'pending';
    if (currentStep === step) return 'active';
    if (currentStep === 'analyzing' || 
        (currentStep === 'combining' && step !== 'analyzing') ||
        (currentStep === 'scraping' && ['discovering'].includes(step)) ||
        (currentStep === 'discovering' && step === 'discovering')) {
      return 'completed';
    }
    return 'pending';
  };

  const getProgressPercentage = () => {
    const steps = ['discovering', 'scraping', 'combining', 'analyzing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1) return 0;
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  };

  const agents = [
    { 
      step: 'discovering', 
      name: 'Step One: Discover Your Website', 
      description: 'Our URL Scout Agent explores your entire website to find every important page.',
      icon: MapPin
    },
    { 
      step: 'scraping', 
      name: 'Step Two: Extract Insights', 
      description: 'Our Content Miner Agent reads and analyzes all your content for valuable information.',
      icon: FileText
    },
    { 
      step: 'combining', 
      name: 'Step Three: Connect the Dots', 
      description: 'Our Data Analyst Agent combines all findings into a clear strategy.',
      icon: BarChart3
    },
    { 
      step: 'analyzing', 
      name: 'Step Four: Build Your Blueprint', 
      description: 'Our Strategy Builder Agent creates your personalized AI Agent Blueprint.',
      icon: Building2
    }
  ];

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
              
              {/* Vertical Timeline Progress Tracker */}
              {isAnalyzing && (
                <div className="mt-8 pt-6 border-t border-gray-600">
                  <div className="space-y-4">
                    {/* Mission Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">🤖 Agent Mission Progress</h3>
                      <p className="text-gray-300 text-sm">
                        Analyzing <span className="text-blue-400 font-mono">{url}</span>
                      </p>
                      <div className="mt-3 flex items-center justify-center space-x-2">
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
                        {agents.map((agent, index) => {
                          const IconComponent = agent.icon;
                          const status = getStepStatus(agent.step);
                          const isLast = index === agents.length - 1;
                          
                          return (
                            <div key={agent.step} className="relative flex items-start">
                              {/* Timeline Node */}
                              <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                status === 'completed' 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                                  : status === 'active'
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg animate-pulse'
                                  : 'bg-gray-600 border-2 border-gray-500'
                              }`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              
                              {/* Content Card */}
                              <div className={`ml-16 flex-1 p-4 rounded-lg border transition-all duration-300 ${
                                status === 'completed' 
                                  ? 'bg-green-500/10 border-green-500/30' 
                                  : status === 'active'
                                  ? 'bg-blue-500/10 border-blue-500/30 animate-pulse'
                                  : 'bg-gray-700/50 border-gray-600'
                              }`}>
                                <h4 className={`font-semibold text-lg mb-2 ${
                                  status === 'completed' || status === 'active' 
                                    ? 'text-white' 
                                    : 'text-gray-400'
                                }`}>
                                  {agent.name}
                                </h4>
                                <p className={`text-sm ${
                                  status === 'completed' || status === 'active' 
                                    ? 'text-gray-300' 
                                    : 'text-gray-500'
                                }`}>
                                  {agent.description}
                                </p>
                                
                                {/* Status Badge */}
                                <div className="mt-3">
                                  <span className={`text-xs px-3 py-1 rounded-full ${
                                    status === 'completed' 
                                      ? 'bg-green-500 text-white' 
                                      : status === 'active'
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-600 text-gray-300'
                                  }`}>
                                    {status === 'completed' ? '✅ Complete' : 
                                     status === 'active' ? '🔄 Working Now' : 
                                     '⏳ Waiting'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="text-center pt-4 border-t border-gray-600">
                      <p className="text-white text-sm font-medium">
                        {getCurrentStatusText()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Analysis Log and Error */}
              {isAnalyzing && analysisLog.length > 0 && (
                <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 mb-6 mt-6">
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
              
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-500 mt-6">
                  <div className="flex items-center space-x-3 text-red-300">
                    <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 