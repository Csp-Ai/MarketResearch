import React from 'react';
import { Target } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-10 md:pt-20 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-200 via-sky-300 to-blue-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-tight text-[#17497A]">
              Your AI Team for Small Business
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed text-[#17497A]">
              Not enough hours in your day? Let digital worker agents handle research, insights, and growth—so you can focus on what matters most.
            </p>
            {/* Infographic - visible only on mobile/tablet (hidden on lg+) */}
            <div className="flex justify-center mb-8 lg:hidden">
              <img 
                src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//heroInfoGraphic.png" 
                alt="AI Team Infographic" 
                className="w-64 h-auto md:w-96 rounded-3xl shadow-2xl border border-gray-100 object-contain bg-white"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
          {/* Right Column - Illustration (visible only on lg+) */}
          <div className="hidden lg:flex items-center justify-center">
            <img 
              src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//heroInfoGraphic.png" 
              alt="AI Team Infographic" 
              className="max-w-xl w-full h-auto rounded-3xl shadow-2xl border border-gray-100 object-contain mx-auto bg-white"
              style={{ maxWidth: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 