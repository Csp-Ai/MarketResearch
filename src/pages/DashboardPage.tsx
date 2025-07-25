import React from 'react';
import Sidebar from '../components/shared/Sidebar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { useBusinessData } from '../hooks/useBusinessData';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { businesses, loading } = useBusinessData();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name || user?.email}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Manage your business, agents, and AI workforce from your hub.
            </p>
          </div>
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Total Businesses</span>
                  <span className="font-semibold">{loading ? '...' : businesses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Analyses Completed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">AI Agents Active</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-gray-500 text-sm">
                <p>No recent activity</p>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm lg:text-base">
                  New Analysis
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm lg:text-base">
                  Add Business
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors text-sm lg:text-base">
                  Configure AI Agents
                </button>
              </div>
            </div>
          </div>
          {/* Saved Businesses */}
          <div className="mt-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Your Businesses</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading businesses...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 lg:p-8 text-center">
                <p className="text-gray-500 mb-4">No businesses added yet.</p>
                <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  Add Your First Business
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {businesses.map((business) => (
                  <div key={business.id} className="bg-white rounded-lg shadow p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {business.business_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{business.website_url}</p>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                        View Analysis
                      </button>
                      <button className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 