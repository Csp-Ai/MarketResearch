import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { Play, Settings, BarChart3, ExternalLink, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  status: 'inactive' | 'active' | 'configuring';
  category: string;
  hasMultiple?: boolean;
  imageUrl?: string;
}

const agents: Agent[] = [
  {
    id: 'chatbots',
    icon: '',
    imageUrl: 'https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//1.png',
    name: 'Smart Chatbots',
    tagline: 'Answer visitor questions 24/7',
    description: 'AI-powered chatbots that use your business information to provide accurate, helpful responses to customer inquiries. You can create and manage multiple chatbots for different purposes.',
    status: 'inactive',
    category: 'Customer Service',
    hasMultiple: true
  },
  {
    id: '2',
    icon: '🧠',
    name: 'Market Research Bot',
    tagline: 'Analyze customer questions & generate insights',
    description: 'Automatically analyzes customer interactions and market trends to provide actionable business insights.',
    status: 'active',
    category: 'Analytics'
  },
  {
    id: '3',
    icon: '✅',
    name: 'ADA Checker',
    tagline: 'Scan site for accessibility compliance',
    description: 'Ensures your website meets accessibility standards and provides recommendations for improvement.',
    status: 'inactive',
    category: 'Compliance'
  },
  {
    id: '4',
    icon: '🛍️',
    name: 'Product Analyzer',
    tagline: 'Pulls top-selling product trends from user data',
    description: 'Analyzes your product performance and customer behavior to identify trends and opportunities.',
    status: 'configuring',
    category: 'Analytics'
  },
  {
    id: '5',
    icon: '📧',
    name: 'Email Assistant',
    tagline: 'Automate email responses and follow-ups',
    description: 'Handles routine email communications and ensures timely follow-ups with customers.',
    status: 'inactive',
    category: 'Communication'
  },
  {
    id: '6',
    icon: '📊',
    name: 'Data Reporter',
    tagline: 'Generate automated business reports',
    description: 'Creates comprehensive reports on your business performance, customer metrics, and market trends.',
    status: 'inactive',
    category: 'Reporting'
  }
];

export default function Agents() {
  const { user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(agents.map(agent => agent.category)))];

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'configuring': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'configuring': return 'Configuring';
      case 'inactive': return 'Inactive';
      default: return 'Inactive';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">AI Agents</h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Discover and configure AI agents to automate your business processes.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredAgents.map((agent) => {
              const isChatbot = agent.id === 'chatbots';
              return (
                <div
                  key={agent.id}
                  className={`relative bg-white rounded-lg shadow-lg p-6 transition-shadow ${!isChatbot ? 'opacity-50 grayscale pointer-events-none cursor-not-allowed' : 'hover:shadow-xl'}`}
                >
                  {/* Coming Soon Overlay */}
                  {!isChatbot && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="bg-black bg-opacity-60 text-white text-lg font-bold px-4 py-2 rounded-lg">Coming Soon</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">
                      {agent.imageUrl ? (
                        <img src={agent.imageUrl} alt={agent.name} className="h-12 w-12 rounded-full object-cover border border-gray-200 bg-white" />
                      ) : (
                        agent.icon
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {getStatusText(agent.status)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{agent.tagline}</p>
                  <p className="text-gray-700 text-sm mb-4">{agent.description}</p>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {agent.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {agent.hasMultiple && (
                      <button
                        className="flex-1 bg-blue-100 text-blue-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                        onClick={() => isChatbot && navigate('/chatbots')}
                        disabled={!isChatbot}
                      >
                        <Users className="h-4 w-4" />
                        <span>See Chatbots</span>
                      </button>
                    )}
                    {/* Only show other buttons if not Smart Chatbots */}
                    {!agent.hasMultiple && agent.status === 'inactive' && (
                      <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1" disabled={!isChatbot}>
                        <Play className="h-4 w-4" />
                        <span>Activate</span>
                      </button>
                    )}
                    {!agent.hasMultiple && agent.status === 'active' && (
                      <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1" disabled={!isChatbot}>
                        <BarChart3 className="h-4 w-4" />
                        <span>View Analytics</span>
                      </button>
                    )}
                    {!agent.hasMultiple && agent.status === 'configuring' && (
                      <button className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1" disabled={!isChatbot}>
                        <Settings className="h-4 w-4" />
                        <span>Continue Setup</span>
                      </button>
                    )}
                    {!agent.hasMultiple && (
                      <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1" disabled={!isChatbot}>
                        <ExternalLink className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No agents found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 