import React from 'react';

export default function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Let’s Set Up Your Business</h1>
        <p className="mb-8 text-gray-600">Start by adding your business information. You can paste your website, enter details manually, or upload a document.</p>
        {/* TODO: Add stepper and input methods here */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center text-blue-700">
          <span className="font-semibold">[Onboarding Wizard Placeholder]</span>
        </div>
      </div>
    </div>
  );
} 