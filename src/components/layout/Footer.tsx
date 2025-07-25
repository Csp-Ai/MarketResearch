import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//CheersMaitLogo.png" 
                alt="CheersMait Logo" 
                className="h-16 w-16 rounded object-cover" 
              />
              <span className="text-xl font-bold">CheersMait!</span>
            </div>
            <p className="text-gray-400">
              A digital workforce of AI agents for small business—ready to research, answer, and grow your brand.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MyAITeam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 