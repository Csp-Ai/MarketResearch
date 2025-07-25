import React from 'react';

const agents = [
  { icon: '💬', name: 'Smart Chatbot', tagline: 'Answer visitor questions 24/7' },
  { icon: '🧠', name: 'Market Research Bot', tagline: 'Analyze customer questions & generate insights' },
  { icon: '✅', name: 'ADA Checker', tagline: 'Scan site for accessibility compliance' },
  { icon: '🛍️', name: 'Product Analyzer', tagline: 'Pulls top-selling product trends from user data' },
];

export default function AgentMarketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Agent Marketplace</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {agents.map((agent, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-transform hover:scale-105">
              <div className="text-5xl mb-4">{agent.icon}</div>
              <div className="font-bold text-lg mb-2 text-blue-900">{agent.name}</div>
              <div className="text-gray-600 mb-4 text-center">{agent.tagline}</div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Preview</button>
              <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition">Activate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 