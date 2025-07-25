import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ChatbotPreview from './ChatbotPreview';

interface EmbeddableChatbotProps {
  chatbotId: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  width?: number;
  height?: number;
}

export default function EmbeddableChatbot({ 
  chatbotId, 
  theme = 'light', 
  position = 'bottom-right',
  width = 350,
  height = 500 
}: EmbeddableChatbotProps) {
  const [chatbot, setChatbot] = useState<any>(null);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatbot = async () => {
      try {
        const { data: chatbotData, error: chatbotError } = await supabase
          .from('chatbots')
          .select('*')
          .eq('id', chatbotId)
          .single();

        if (chatbotError) throw chatbotError;
        setChatbot(chatbotData);

        if (chatbotData.business_id) {
          const { data: businessData } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', chatbotData.business_id)
            .single();

          if (businessData) {
            setBusinessInfo(businessData);
          }
        }
      } catch (err) {
        console.error('Failed to load chatbot:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbot();
  }, [chatbotId]);

  if (loading || !chatbot) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        style={{ background: chatbot.primary_color || '#2563eb' }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className={`mt-4 rounded-lg shadow-xl border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            background: chatbot.secondary_color || '#eff6ff'
          }}
        >
          <ChatbotPreview 
            config={{
              ...chatbot,
              avatar: chatbot.avatar_url || 'https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//1.png',
              primaryColor: chatbot.primary_color || '#2563eb',
              secondaryColor: chatbot.secondary_color || '#eff6ff',
              languages: chatbot.languages || ['English']
            }}
            businessInfo={businessInfo}
          />
        </div>
      )}
    </div>
  );
} 