import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoRequestPage() {
  const navigate = useNavigate();

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-300 to-blue-200">
      <div className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Demo Request Form */}
          <div className="text-left">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-2xl mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-tight text-[#17497A]">
                Request a Demo
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed text-[#17497A]">
                Fill out the form below and our team will reach out to schedule your personalized demo.
              </p>
              <form className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300" 
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300" 
                />
                <textarea 
                  placeholder="Your Message (optional)" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800 font-medium transition-all duration-300 hover:border-gray-300" 
                />
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-sky-400 to-blue-300 text-[#102A43] font-extrabold px-8 py-4 rounded-xl hover:from-sky-500 hover:to-blue-400 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit Request
                </button>
              </form>
              <button 
                onClick={handleBackToLanding} 
                className="mt-6 text-blue-700 hover:underline"
              >
                Back to Home
              </button>
            </div>
          </div>
          
          {/* Right Column - Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <img 
              src="https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//heroInfoGraphic.png" 
              alt="AI Team Infographic" 
              className="max-w-xl w-full h-auto rounded-3xl shadow-2xl border border-gray-100 object-contain mx-auto"
              style={{background: 'white'}}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 