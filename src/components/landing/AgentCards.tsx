import React from 'react';

export default function AgentCards() {
  return (
    <section className="mt-24 pt-16 border-t border-white/10 bg-gradient-to-b from-sky-200 via-sky-300 to-blue-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">Your AI Agent Team</h2>
        <p className="text-xl text-gray-200 text-center mb-12 max-w-3xl mx-auto">
          Choose from our specialized AI agents designed for small business success.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer Service Chatbot/Voice Agent */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center">
            <img 
              src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//1.png" 
              alt="Customer Service Bot" 
              className="h-28 w-28 object-contain mb-6" 
            />
            <h3 className="text-gray-800 font-bold text-center mb-3 text-lg">
              Customer Service Chatbot/Voice Agent
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Deploy on your website or via QR code to handle customer questions, support, and engagement 24/7.
            </p>
          </div>
          
          {/* Market Research & Competitor Research Bot */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center">
            <img 
              src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//2.png" 
              alt="Market Research Bot" 
              className="h-28 w-28 object-contain mb-6" 
            />
            <h3 className="text-gray-800 font-bold text-center mb-3 text-lg">
              Market & Competitor Research Bot
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Use current tools and AI to get an edge on your competitors and understand your market in real time.
            </p>
          </div>
          
          {/* Content Generation/Marketing Bot */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center">
            <img 
              src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//3.png" 
              alt="Content Generation Bot" 
              className="h-28 w-28 object-contain mb-6" 
            />
            <h3 className="text-gray-800 font-bold text-center mb-3 text-lg">
              Content Generation & Marketing Bot
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Create marketing content, blog posts, and social media updates to grow your brand and reach more customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 