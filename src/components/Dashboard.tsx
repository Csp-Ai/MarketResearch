import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  User, 
  Search, 
  BarChart3, 
  FileText, 
  Bot,
  TrendingUp,
  Globe,
  Download,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reports, setReports] = useState([
    {
      id: 1,
      url: 'https://example.com',
      status: 'completed',
      createdAt: '2024-01-15',
      title: 'E-commerce Market Analysis'
    },
    {
      id: 2,
      url: 'https://competitor.com',
      status: 'processing',
      createdAt: '2024-01-14',
      title: 'Competitor Analysis Report'
    }
  ]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleStartAnalysis = () => {
    if (url) {
      setIsAnalyzing(true);
      // Simulate analysis process
      setTimeout(() => {
        setIsAnalyzing(false);
        // Add new report to the list
        const newReport = {
          id: reports.length + 1,
          url: url,
          status: 'processing',
          createdAt: new Date().toISOString().split('T')[0],
          title: `Analysis for ${new URL(url).hostname}`
        };
        setReports([newReport, ...reports]);
        setUrl('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MarketMind AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="hidden sm:block">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Start a new market analysis or review your previous reports.
          </p>
        </div>

        {/* New Analysis Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Start New Analysis</h2>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'processing').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.url}</p>
                      <p className="text-xs text-gray-500">Created on {report.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {report.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                    {report.status === 'completed' && (
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}