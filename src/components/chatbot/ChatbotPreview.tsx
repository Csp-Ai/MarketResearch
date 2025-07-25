import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const languageFlags: Record<string, string> = {
  English: '🇺🇸',
  Spanish: '🇪🇸',
};

function businessInfoToString(business: any): string {
  if (!business) return '';
  return [
    business.business_name && `Business Name: ${business.business_name}`,
    business.description && `Description: ${business.description}`,
    business.industry && `Industry: ${business.industry}`,
    business.website_url && `Website: ${business.website_url}`,
    business.services && `Services: ${business.services}`,
    business.contact_info && `Contact Info: ${business.contact_info}`,
    // Add more fields as needed
  ].filter(Boolean).join('\n');
}

async function sendChatMessage(messages: any[], chatbot: any, businessInfo: any = '') {
  const businessInfoString = businessInfoToString(businessInfo);
  const apiUrl = import.meta.env.VITE_AGENTIAL_API || 'http://localhost:8000';
  const res = await fetch(`${apiUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatbot,
      messages,
      businessInfo: businessInfoString
    })
  });
  const data = await res.json();
  return data.answer;
}

interface ChatbotPreviewProps {
  config: any;
  businessInfo?: any;
}

export default function ChatbotPreview({ config, businessInfo = '' }: ChatbotPreviewProps) {
  const primary = config.primaryColor || '#2563eb';
  const secondary = config.secondaryColor || '#eff6ff';
  const text = '#1e3a8a';
  const [messages, setMessages] = useState([
    { role: 'assistant', content: config.greeting || 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState((config.languages && config.languages.length > 0) ? config.languages[0] : 'English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const flag = languageFlags[currentLang] || '🌐';
  const { user } = useAuth();

  // Helper to save chat history to Supabase
  const saveChatHistory = async (allMessages: any[]) => {
    if (!user || !config.id) return; // require user and chatbot_id
    const { error } = await supabase.from('chat_histories').insert([
      {
        chatbot_id: config.id,
        user_id: user.id,
        messages: allMessages,
      }
    ]);
    if (error) {
      // Optionally handle error (e.g., show notification)
      console.error('Failed to save chat history:', error);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    setMessages(newMessages);
    setLoading(true);
    try {
      const answer = await sendChatMessage(newMessages, config, businessInfo);
      const updatedMessages = [...newMessages, { role: 'assistant', content: answer }];
      setMessages(updatedMessages);
      // Save to Supabase after assistant responds
      await saveChatHistory(updatedMessages);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error.' }]);
    }
    setLoading(false);
    setInput('');
  };

  const allowedLangs = config.languages && config.languages.length > 0 ? config.languages : ['English'];

  return (
    <div className="rounded-lg shadow flex flex-col min-h-[400px] max-h-[600px]" style={{ background: secondary }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-t-lg relative" style={{ background: primary }}>
        <img src={config.avatar} alt="Chatbot" className="h-8 w-8 rounded-full object-cover border border-white bg-white" />
        <div className="flex-1">
          <div className="font-bold text-white text-base">{config.name || 'Chatbot'}</div>
          <div className="text-xs text-white/80">{config.tone}</div>
        </div>
        {/* Language Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 text-2xl ml-2 focus:outline-none"
            onClick={() => setShowLangDropdown(v => !v)}
          >
            <span>{flag}</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50 border border-gray-200">
              {allowedLangs.map((lang: string) => (
                <button
                  key={lang}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 ${currentLang === lang ? 'font-bold text-blue-700' : 'text-gray-700'}`}
                  onClick={() => { setCurrentLang(lang); setShowLangDropdown(false); }}
                >
                  <span>{languageFlags[lang] || '🌐'}</span>
                  <span>{lang}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ background: secondary }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${msg.role === 'user' ? 'bg-white text-gray-900 border border-gray-200' : ''}`} style={msg.role === 'assistant' ? { background: primary, color: 'white' } : {}}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start"><div className="px-4 py-2 rounded-lg max-w-xs text-sm bg-gray-100 text-gray-400 border border-gray-200">...</div></div>
        )}
      </div>
      {/* Input Area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 rounded-b-lg" style={{ background: secondary }}>
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="text-white px-4 py-2 rounded-lg font-semibold transition"
          style={{ background: primary, color: 'white' }}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-7.5-15-7.5v6.75l10.5.75-10.5.75v6.75z" />
          </svg>
        </button>
      </form>
    </div>
  );
} 