import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Chatbot {
  id: string;
  owner_id: string;
  business_id?: string | null;
  name: string;
  description?: string;
  greeting?: string;
  tone?: string;
  avatar_url?: string;
  knowledge_sources?: any;
  response_style?: string;
  allowed_topics?: any;
  forbidden_topics?: any;
  languages?: any;
  accessibility_options?: any;
  config?: any;
  created_at: string;
  updated_at: string;
}

export const useChatbots = () => {
  const { user } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatbots = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChatbots(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addChatbot = async (chatbotData: Partial<Chatbot>) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const { data, error } = await supabase
        .from('chatbots')
        .insert({ ...chatbotData, owner_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setChatbots(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateChatbot = async (id: string, updates: Partial<Chatbot>) => {
    try {
      const { data, error } = await supabase
        .from('chatbots')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setChatbots(prev => prev.map(bot => bot.id === id ? data : bot));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteChatbot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setChatbots(prev => prev.filter(bot => bot.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (user) fetchChatbots();
  }, [user]);

  return {
    chatbots,
    loading,
    error,
    fetchChatbots,
    addChatbot,
    updateChatbot,
    deleteChatbot
  };
}; 