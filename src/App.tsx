import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Search, 
  Bot, 
  BarChart3, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  TrendingUp,
  Users,
  Star,
  Play,
  ChevronRight
} from 'lucide-react';
import { supabase } from './lib/supabase';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setCurrentView('dashboard');
      }
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentView('dashboard');
      } else {
        setUser(null);
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartAnalysis = () => {
    if (url) {
      setIsAnalyzing(true);
      // Simulate analysis process
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
  };

  if (currentView === 'auth') {
    return <AuthPage onBack={handleBackToLanding} onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MarketMind AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Market Research
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                In Minutes, Not Weeks
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Simply enter any website URL and our AI agent will scrape, analyze, and deliver comprehensive 
              market intelligence with competitor insights and actionable recommendations.
            </p>
            
            {/* URL Input Demo */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="Enter website URL (e.g., https://example.com)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={handleStartAnalysis}
                    disabled={!url || isAnalyzing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
                {isAnalyzing && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span>Scraping website data and analyzing competitors...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">5,000+</div>
                <div className="text-gray-600">Websites Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">15min</div>
                <div className="text-gray-600">Average Report Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI agent follows a simple 4-step process to deliver comprehensive market insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. URL Input</h3>
              <p className="text-gray-600">
                Simply paste any website URL and our AI begins the analysis process
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Data Scraping</h3>
              <p className="text-gray-600">
                Advanced web scraping extracts content, structure, and key business information
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. AI Analysis</h3>
              <p className="text-gray-600">
                Machine learning algorithms analyze market position and identify competitors
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Detailed Report</h3>
              <p className="text-gray-600">
                Receive actionable insights with competitor analysis and growth opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand your market and stay ahead of competitors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Positioning</h3>
              <p className="text-gray-600">
                Understand where your business stands in the market landscape with detailed positioning analysis.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitor Analysis</h3>
              <p className="text-gray-600">
                Identify key competitors and analyze their strategies, strengths, and weaknesses.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Metrics</h3>
              <p className="text-gray-600">
                Get detailed performance insights including traffic estimates and engagement metrics.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">SEO Analysis</h3>
              <p className="text-gray-600">
                Comprehensive SEO audit with keyword analysis and optimization recommendations.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Reports</h3>
              <p className="text-gray-600">
                Professional PDF reports with actionable insights and strategic recommendations.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-indigo-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Advanced machine learning algorithms provide deeper insights than traditional tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "MarketMind AI saved us weeks of research. The competitor analysis was incredibly detailed and actionable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Marketing Director</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The insights we got helped us identify new market opportunities we never would have found otherwise."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-600">Startup Founder</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Fast, accurate, and incredibly comprehensive. This tool has become essential for our business strategy."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                  <div className="text-sm text-gray-600">Business Analyst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Unlock Market Insights?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using AI-powered market research to stay ahead of the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Free Analysis</span>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
              <span>View Sample Report</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">MarketMind AI</span>
              </div>
              <p className="text-gray-400">
                AI-powered market research that delivers actionable insights in minutes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MarketMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;