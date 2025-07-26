import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useBusinessData } from '../hooks/useBusinessData';
import { useChatbots } from '../hooks/useChatbots';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { businesses, loading } = useBusinessData();
  const { chatbots, loading: chatbotsLoading } = useChatbots();
  const navigate = useNavigate();

  // Calculate agent workforce metrics based on chatbots
  const agentMetrics = {
    aiAgentsActive: chatbots.length,
    totalAgents: chatbots.length,
    agentEfficiency: chatbots.length > 0 ? Math.min(chatbots.length * 20, 100) : 0, // Mock efficiency based on agent count
    teamScore: chatbots.length > 0 ? Math.min(chatbots.length * 25, 100) : 25 // Mock team score based on agent count
  };

  const getTeamStatus = (score: number) => {
    if (score >= 80) return { status: 'High Performance', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { status: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Needs Setup', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const teamStatus = getTeamStatus(agentMetrics.teamScore);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          {/* Welcome Panel */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Welcome back, {user?.full_name || user?.email?.split('@')[0]} 👋
              </h1>
              <p className="text-blue-100 text-sm lg:text-base">
                Here's how your AI agent workforce is performing today.
              </p>
            </div>
          </div>

          {/* AI Agent Workforce Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Active AI Agents */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xs text-gray-500">Active Agents</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {agentMetrics.aiAgentsActive}
              </div>
              <p className="text-xs text-gray-600">
                {agentMetrics.aiAgentsActive === 0 
                  ? "No AI agents deployed yet."
                  : "Agents currently working"
                }
              </p>
            </div>

            {/* Total Agents */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👥</span>
                <span className="text-xs text-gray-500">Total Team</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {agentMetrics.totalAgents}
              </div>
              <p className="text-xs text-gray-600">
                {agentMetrics.totalAgents === 0 
                  ? "No agents in your workforce"
                  : "Agents in your team"
                }
              </p>
            </div>

            {/* Agent Efficiency */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xs text-gray-500">Efficiency</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {agentMetrics.agentEfficiency || '--'}%
              </div>
              <p className="text-xs text-gray-600">
                {agentMetrics.agentEfficiency === 0 
                  ? "No efficiency data"
                  : "Team efficiency rate"
                }
              </p>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📈</span>
                <span className="text-xs text-gray-500">Performance</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {agentMetrics.teamScore}%
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${teamStatus.bgColor} ${teamStatus.color}`}>
                {teamStatus.status}
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">💡</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {businesses.length === 0 
                    ? "Build your AI agent workforce"
                    : "Deploy your first AI agent"
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {businesses.length === 0 
                    ? "Create your first business to start building your digital agent team that can handle customer service, sales, and operations."
                    : "Deploy AI agents to automate customer interactions and scale your business operations."
                  }
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => navigate('/agents')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                    >
                      Deploy AI Agent
                    </button>
                    <span className="text-sm text-gray-500">Configure and deploy your first agent</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="bg-gray-400 text-white py-2 px-6 rounded-lg font-medium cursor-not-allowed opacity-50">
                      Analyze Website
                    </button>
                    <span className="text-sm text-gray-500">Coming soon - Site analysis and optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Agent Workforce Section */}
          <div className="mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Your AI Agent Team</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading businesses...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {chatbots.length === 0 ? 'No AI agents deployed yet' : `${chatbots.length} AI agent${chatbots.length === 1 ? '' : 's'} deployed`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {chatbots.length === 0 
                    ? 'Add your first business to start building your AI agent workforce.'
                    : 'Your AI agents are ready to help scale your business operations.'
                  }
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                  Add Your First Business
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {businesses.map((business) => (
                  <div key={business.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {business.business_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {business.business_name}
                          </h3>
                          <p className="text-sm text-gray-600">{business.website_url || 'No website'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${teamStatus.bgColor}`}></div>
                        <span className="text-xs text-gray-500">{teamStatus.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {chatbots.filter(chatbot => chatbot.business_id === business.id).length}
                        </div>
                        <div className="text-xs text-gray-500">Agents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">--</div>
                        <div className="text-xs text-gray-500">Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">--</div>
                        <div className="text-xs text-gray-500">Efficiency</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-xs text-gray-500">Agent deployment coming soon</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Snapshot */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🧭</span>
              Weekly Agent Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">{chatbots.length}</div>
                <div className="text-sm text-gray-600">AI agents running this week</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-600">Tasks completed in last 7 days</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">--</div>
                <div className="text-sm text-gray-600">
                  {businesses.length === 0 ? 'No businesses connected' : chatbots.length === 0 ? 'No agents deployed yet' : `${chatbots.length} agents deployed`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 