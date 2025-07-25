import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ConversationHistoryProps {
  chatbotId: string;
  onClose: () => void;
}

interface ChatHistory {
  id: string;
  user_id: string;
  messages: { role: string; content: string }[];
  created_at: string;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ chatbotId, onClose }) => {
  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const [selected, setSelected] = useState<ChatHistory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_histories')
        .select('*')
        .eq('chatbot_id', chatbotId)
        .order('created_at', { ascending: false });
      if (!error && data) setHistories(data);
      setLoading(false);
    };
    fetchHistories();
  }, [chatbotId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Conversation History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex gap-6">
            <div className="w-1/3 border-r pr-4 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold mb-2 text-gray-700">Conversations</h3>
              <ul>
                {histories.map(h => (
                  <li key={h.id}>
                    <button
                      className={`block w-full text-left px-2 py-1 rounded mb-1 ${selected?.id === h.id ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelected(h)}
                    >
                      {new Date(h.created_at).toLocaleString()}
                    </button>
                  </li>
                ))}
                {histories.length === 0 && <li className="text-gray-400">No conversations found.</li>}
              </ul>
            </div>
            <div className="flex-1 pl-4 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold mb-2 text-gray-700">Messages</h3>
              {selected ? (
                <div className="space-y-2">
                  {selected.messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                        <span className="font-semibold mr-2">{msg.role === 'user' ? 'You' : 'Bot'}:</span>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">Select a conversation to view messages.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory; 