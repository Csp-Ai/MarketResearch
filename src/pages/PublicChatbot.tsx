import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ChatbotPreview from '../components/chatbot/ChatbotPreview';

interface Chatbot {
  id: string;
  name: string;
  description?: string;
  greeting?: string;
  tone?: string;
  avatar_url?: string;
  primary_color?: string;
  secondary_color?: string;
  languages?: string[];
  business_id?: string;
}

export default function PublicChatbot() {
  const { chatbotId } = useParams();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatbot = async () => {
      if (!chatbotId) return;
      
      try {
        // Fetch chatbot data
        const { data: chatbotData, error: chatbotError } = await supabase
          .from('chatbots')
          .select('*')
          .eq('id', chatbotId)
          .single();

        if (chatbotError) throw chatbotError;
        if (!chatbotData) {
          setError('Chatbot not found');
          setLoading(false);
          return;
        }

        setChatbot(chatbotData);

        // Fetch business info if chatbot has business_id
        if (chatbotData.business_id) {
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', chatbotData.business_id)
            .single();

          if (!businessError && businessData) {
            setBusinessInfo(businessData);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load chatbot');
      } finally {
        setLoading(false);
      }
    };

    fetchChatbot();
  }, [chatbotId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chatbot Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This chatbot doesn\'t exist or has been removed.'}</p>
          <a href="/" className="text-blue-600 hover:text-blue-700">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{chatbot.name}</h1>
          {chatbot.description && (
            <p className="text-gray-600">{chatbot.description}</p>
          )}
        </div>
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
    </div>
  );
} 