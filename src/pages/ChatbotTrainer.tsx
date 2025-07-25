import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Footer from '../components/layout/Footer';
import { useParams, useNavigate } from 'react-router-dom';

const steps = [
  'Greeting & Personality',
  'Knowledge Sources',
  'Response Behavior',
  'Language & Accessibility',
  'Live Preview',
  'Deployment'
];

export default function ChatbotTrainer() {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 max-w-3xl mx-auto w-full">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((label, idx) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${idx === step ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
                <span className={`text-xs mt-2 text-center ${idx === step ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>{label}</span>
                {idx < steps.length - 1 && <div className="h-1 w-full bg-gray-200 mt-2 mb-2" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 min-h-[300px] flex flex-col">
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Greeting & Personality Setup</h2>
                {/* TODO: Add form fields for name, greeting, tone, avatar upload */}
                <div className="text-gray-500">[Greeting & Personality form goes here]</div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Knowledge Source Selection</h2>
                {/* TODO: Add toggles for data sources, edit business info button */}
                <div className="text-gray-500">[Knowledge Source selection UI goes here]</div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Response Behavior Settings</h2>
                {/* TODO: Add accordions for response style, allowed/forbidden topics, advanced */}
                <div className="text-gray-500">[Response Behavior settings UI goes here]</div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Language & Accessibility</h2>
                {/* TODO: Add checkboxes/toggles for languages, accessibility */}
                <div className="text-gray-500">[Language & Accessibility UI goes here]</div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                {/* TODO: Add chat simulator preview */}
                <div className="text-gray-500">[Live Preview UI goes here]</div>
              </div>
            )}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Deployment Instructions</h2>
                {/* TODO: Add embed code, hosted link, QR code tabs */}
                <div className="text-gray-500">[Deployment instructions UI goes here]</div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={goNext}
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => navigate('/chatbots')}
                className="px-4 py-2 rounded bg-green-600 text-white font-semibold"
              >
                Finish
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
} 