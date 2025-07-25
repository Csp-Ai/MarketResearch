import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { Plus, Edit, Trash2, MessageCircle, Building2, FileText, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatbotPreview from '../components/chatbot/ChatbotPreview';
import { useChatbots } from '../hooks/useChatbots';
import { useBusinessData } from '../hooks/useBusinessData';
import { supabase } from '../lib/supabase';
import ConversationHistory from '../components/chatbot/ConversationHistory';
import SharingControls from '../components/chatbot/SharingControls';

const CHATBOT_IMAGE_URL = 'https://zndjecytemrxgvddwbfx.supabase.co/storage/v1/object/public/assets//1.png';

const toneOptions = ['Friendly', 'Professional', 'Quirky', 'Chill'];
const responseStyles = ['Short', 'Medium', 'Long'];
const languageOptions = ['English', 'Spanish'];
const knowledgeSourceOptions = ['Business Vault', 'Manual Entry'];
const defaultColorPairs = [
  { name: 'Blue', primary: '#2563eb', secondary: '#eff6ff', text: '#1e3a8a' },
  { name: 'Green', primary: '#22c55e', secondary: '#f0fdf4', text: '#166534' },
  { name: 'Purple', primary: '#a21caf', secondary: '#f5f3ff', text: '#581c87' },
  { name: 'Orange', primary: '#f59e42', secondary: '#fff7ed', text: '#b45309' }
];

export default function Chatbots() {
  const { user, logout } = useAuth();
  const { chatbots, loading, addChatbot, updateChatbot, deleteChatbot } = useChatbots();
  const { businesses } = useBusinessData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [editStatus, setEditStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [editError, setEditError] = useState<string | null>(null);
  const [historyChatbotId, setHistoryChatbotId] = useState<string | null>(null);
  const [selectedChatbotForSharing, setSelectedChatbotForSharing] = useState<any>(null);

  // Add Chatbot Handler
  const handleAdd = async () => {
    try {
      // Ensure avatar_url is set to default if missing
      const avatarUrl = formData.avatar_url || CHATBOT_IMAGE_URL;
      // Map camelCase fields to snake_case for DB
      const payload = {
        name: formData.name,
        description: formData.description,
        greeting: formData.greeting,
        tone: formData.tone,
        avatar_url: avatarUrl,
        business_id: selectedBusinessId || null,
        knowledge_sources: formData.knowledgeSources,
        manual_entries: formData.manualEntries || [],
        prompts: formData.prompts,
        response_style: formData.responseStyle,
        primary_color: formData.primaryColor,
        secondary_color: formData.secondaryColor,
        include_emojis: formData.includeEmojis,
        allow_hallucination: formData.allowHallucination,
        languages: formData.languages || [],
        accessibility: formData.accessibility,
        accessibility_options: { readAloud: formData.accessibility },
      };
      await addChatbot(payload);
      setShowAddForm(false);
      setFormData(null);
      setSelectedBusinessId(null);
    } catch (err) {
      // handle error
    }
  };

  // Edit Chatbot Handler
  const handleEditSave = async () => {
    if (!editingId) return;
    setEditStatus('saving');
    setEditError(null);
    try {
      // Map camelCase fields to snake_case for DB
      const payload = {
        name: formData.name,
        description: formData.description,
        greeting: formData.greeting,
        tone: formData.tone,
        avatar_url: formData.avatar_url,
        business_id: selectedBusinessId || null,
        knowledge_sources: formData.knowledgeSources,
        manual_entries: formData.manualEntries || [],
        prompts: formData.prompts,
        response_style: formData.responseStyle,
        primary_color: formData.primaryColor,
        secondary_color: formData.secondaryColor,
        include_emojis: formData.includeEmojis,
        allow_hallucination: formData.allowHallucination,
        languages: formData.languages || [],
        accessibility: formData.accessibility,
        accessibility_options: { readAloud: formData.accessibility },
      };
      await updateChatbot(editingId, payload);
      setEditStatus('success');
      setTimeout(() => {
        setEditStatus('idle');
        setEditingId(null);
        setFormData(null);
        setSelectedBusinessId(null);
      }, 1200);
    } catch (err: any) {
      setEditStatus('error');
      setEditError(err.message || 'Save failed');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(null);
  };

  const handleDelete = (id: string) => {
    deleteChatbot(id);
  };

  // --- Edit Mode ---
  if (editingId && formData) {
    // Handler for avatar upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) {
        alert('Error uploading avatar!');
        return;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrlData.publicUrl });
    };
    // Handler for manual entries
    const handleManualEntryChange = (idx: number, value: string) => {
      const manualEntries = [...(formData.manualEntries || [''])];
      manualEntries[idx] = value;
      setFormData({ ...formData, manualEntries });
    };
    const handleAddManualEntry = () => {
      setFormData({ ...formData, manualEntries: [...(formData.manualEntries || []), ''] });
    };
    const handleRemoveManualEntry = (idx: number) => {
      const manualEntries = (formData.manualEntries || []).filter((_: any, i: number) => i !== idx);
      setFormData({ ...formData, manualEntries });
    };
    // Handler for prompts (restore)
    const handlePromptChange = (idx: number, value: string) => {
      const prompts = [...(formData.prompts || [''])];
      prompts[idx] = value;
      setFormData({ ...formData, prompts });
    };
    const handleAddPrompt = () => {
      setFormData({ ...formData, prompts: [...(formData.prompts || []), ''] });
    };
    const handleRemovePrompt = (idx: number) => {
      const prompts = (formData.prompts || []).filter((_: any, i: number) => i !== idx);
      setFormData({ ...formData, prompts });
    };
    // Handler for color scheme
    const handleColorScheme = (name: string) => {
      setFormData({ ...formData, colorScheme: name });
    };
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar onLogout={logout} />
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
            <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8">
              {/* Edit Form */}
              <form className="flex-1 space-y-8" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                {/* 1. Greeting & Personality */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Greeting & Personality</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Chatbot Name</label>
                    <input type="text" className="w-full px-3 py-2 border rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Greeting Message</label>
                    <input type="text" className="w-full px-3 py-2 border rounded" value={formData.greeting} onChange={e => setFormData({ ...formData, greeting: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tone/Personality</label>
                    <select className="w-full px-3 py-2 border rounded" value={formData.tone} onChange={e => setFormData({ ...formData, tone: e.target.value })}>
                      {toneOptions.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                    </select>
                  </div>
                  {/* Avatar upload */}
                  <div className="mb-2 flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Avatar</label>
                      <img src={formData.avatar_url || CHATBOT_IMAGE_URL} alt="Avatar" className="h-12 w-12 rounded-full border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Upload Image</label>
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="block" />
                    </div>
                  </div>
                </div>
                {/* 2. Knowledge Sources (modern box style) */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Knowledge Sources</h2>
                  <div className="flex gap-6 mb-6 flex-wrap">
                    {/* Business Vault */}
                    <button
                      type="button"
                      className={`flex flex-col items-center justify-center w-40 h-32 rounded-xl border-2 transition-all text-center px-4 py-2 gap-2 ${(formData.knowledgeSources || []).includes('Business Vault') ? 'border-blue-600 bg-blue-50 shadow' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          knowledgeSources: (formData.knowledgeSources || []).includes('Business Vault')
                            ? (formData.knowledgeSources || []).filter((s: string) => s !== 'Business Vault')
                            : [...(formData.knowledgeSources || []), 'Business Vault']
                        });
                      }}
                    >
                      <Building2 className="h-8 w-8 mb-1 text-blue-700" />
                      <span className="font-semibold text-base">Business Vault</span>
                      <span className="text-xs text-gray-500">Use your saved business info</span>
                    </button>
                    {/* Manual Entry */}
                    <button
                      type="button"
                      className={`flex flex-col items-center justify-center w-40 h-32 rounded-xl border-2 transition-all text-center px-4 py-2 gap-2 ${(formData.knowledgeSources || []).includes('Manual Entry') ? 'border-blue-600 bg-blue-50 shadow' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          knowledgeSources: (formData.knowledgeSources || []).includes('Manual Entry')
                            ? (formData.knowledgeSources || []).filter((s: string) => s !== 'Manual Entry')
                            : [...(formData.knowledgeSources || []), 'Manual Entry']
                        });
                      }}
                    >
                      <FileText className="h-8 w-8 mb-1 text-blue-700" />
                      <span className="font-semibold text-base">Manual Entry</span>
                      <span className="text-xs text-gray-500">Add custom knowledge</span>
                    </button>
                  </div>
                  {/* Business Vault details */}
                  {(formData.knowledgeSources || []).includes('Business Vault') && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Associated Business</label>
                      <select
                        className="w-full px-3 py-2 border rounded"
                        value={selectedBusinessId || ''}
                        onChange={e => setSelectedBusinessId(e.target.value || null)}
                      >
                        <option value="">None</option>
                        {businesses.map(business => (
                          <option key={business.id} value={business.id}>{business.business_name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Manual Entry Section */}
                  {(formData.knowledgeSources || []).includes('Manual Entry') && (
                    <div className="mb-2">
                      <h3 className="font-semibold mb-2">Manual Knowledge Entries</h3>
                      <div className="space-y-4">
                        {(formData.manualEntries || ['']).map((entry: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <textarea
                              className="w-full px-3 py-2 border rounded resize-vertical min-h-[60px]"
                              value={entry}
                              onChange={e => handleManualEntryChange(idx, e.target.value)}
                              placeholder={`Manual Entry ${idx + 1}`}
                            />
                            <button type="button" className="text-red-500 px-2 mt-2" onClick={() => handleRemoveManualEntry(idx)}>&times;</button>
                          </div>
                        ))}
                        <button type="button" className="text-blue-600 underline text-sm" onClick={handleAddManualEntry}>+ Add Entry</button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Training Section: Prompts + Behavior */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Training</h2>
                  {/* Prompts */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Response Prompts</h3>
                    <div className="space-y-3">
                      {(formData.prompts || ['']).map((prompt: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={prompt}
                            onChange={e => handlePromptChange(idx, e.target.value)}
                            placeholder={`Prompt ${idx + 1}`}
                          />
                          <button type="button" className="text-red-500 px-2" onClick={() => handleRemovePrompt(idx)}>&times;</button>
                        </div>
                      ))}
                      <button type="button" className="text-blue-600 underline text-sm" onClick={handleAddPrompt}>+ Add Prompt</button>
                    </div>
                  </div>
                  {/* Behavior */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Response Style</label>
                    <select className="w-full px-3 py-2 border rounded" value={formData.responseStyle} onChange={e => setFormData({ ...formData, responseStyle: e.target.value })}>
                      {responseStyles.map(style => <option key={style} value={style}>{style}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.allowHallucination} onChange={e => setFormData({ ...formData, allowHallucination: e.target.checked })} />
                      Allow hallucination fallback?
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.includeEmojis} onChange={e => setFormData({ ...formData, includeEmojis: e.target.checked })} />
                      Include emojis
                    </label>
                  </div>
                </div>
                {/* 4. Language & Accessibility */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Language & Accessibility</h2>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {languageOptions.map(lang => (
                      <label key={lang} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(formData?.languages || []).includes(lang)}
                          onChange={e => {
                            const checked = e.target.checked;
                            setFormData({
                              ...formData,
                              languages: checked
                                ? [...formData.languages, lang]
                                : formData.languages.filter((l: string) => l !== lang)
                            });
                          }}
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                  {/* Read-aloud option removed */}
                </div>
                {/* 5. Color Scheme & Design */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Color Scheme & Design</h2>
                  <div className="flex gap-4 mb-4 flex-wrap">
                    {defaultColorPairs.map(pair => (
                      <button
                        key={pair.name}
                        type="button"
                        className={`rounded-lg px-4 py-2 font-semibold border-2 flex items-center gap-2 ${formData.primaryColor === pair.primary && formData.secondaryColor === pair.secondary ? 'border-blue-600' : 'border-gray-200'}`}
                        style={{ background: pair.secondary, color: pair.text }}
                        onClick={() => setFormData({ ...formData, primaryColor: pair.primary, secondaryColor: pair.secondary })}
                      >
                        <span className="w-4 h-4 rounded-full inline-block border border-gray-300" style={{ background: pair.primary }}></span>
                        <span className="w-4 h-4 rounded-full inline-block border border-gray-300" style={{ background: pair.secondary }}></span>
                        {pair.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-8 items-center flex-wrap">
                    <div>
                      <label className="block text-sm font-medium mb-1">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primaryColor || '#2563eb'}
                          onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                          className="w-10 h-8 p-0 border-0"
                        />
                        <span className="w-6 h-6 rounded-full border border-gray-300 inline-block" style={{ background: formData.primaryColor || '#2563eb' }}></span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.secondaryColor || '#eff6ff'}
                          onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                          className="w-10 h-8 p-0 border-0"
                        />
                        <span className="w-6 h-6 rounded-full border border-gray-300 inline-block" style={{ background: formData.secondaryColor || '#eff6ff' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Save/Cancel */}
                <div className="flex gap-4 mt-6 items-center">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60" disabled={editStatus === 'saving'}>
                    {editStatus === 'saving' ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300" onClick={handleCancel}>Cancel</button>
                  {editStatus === 'success' && <span className="text-green-600 ml-4">Save successful!</span>}
                  {editStatus === 'error' && <span className="text-red-600 ml-4">{editError || 'Save failed'}</span>}
                </div>
              </form>
              {/* Live Preview */}
              <div className="w-full lg:w-[400px] flex-shrink-0">
                <ChatbotPreview 
                  config={{ 
                    ...formData, 
                    avatar: formData?.avatar_url || CHATBOT_IMAGE_URL, 
                    primaryColor: formData?.primaryColor || formData?.primary_color || defaultColorPairs[0].primary, 
                    secondaryColor: formData?.secondaryColor || formData?.secondary_color || defaultColorPairs[0].secondary 
                  }}
                  businessInfo={
                    (formData.knowledgeSources || []).includes('Business Vault') && selectedBusinessId
                      ? businesses.find(b => b.id === selectedBusinessId)
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Chatbots List ---
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Smart Chatbots</h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Create, manage, and train multiple chatbots for your business.
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  avatar_url: CHATBOT_IMAGE_URL,
                  name: '',
                  description: '',
                  greeting: '',
                  tone: toneOptions[0],
                  languages: ['English'],
                  knowledgeSources: [],
                  manualEntries: [''],
                  prompts: [''],
                  responseStyle: responseStyles[0],
                  primaryColor: defaultColorPairs[0].primary,
                  secondaryColor: defaultColorPairs[0].secondary,
                  includeEmojis: false,
                  allowHallucination: false,
                  accessibility: false
                });
                setShowAddForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Chatbot</span>
            </button>
          </div>
          {/* Add Form (unchanged for now) */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Chatbot</h3>
              <div className="mb-4 flex flex-col items-center">
                <img src={formData?.avatar_url || CHATBOT_IMAGE_URL} alt="Chatbot Avatar" className="h-20 w-20 rounded-full object-cover border border-gray-200 bg-white mb-2" />
                <span className="text-xs text-gray-500">Default Avatar</span>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Chatbot Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" value={formData?.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Associated Business</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={selectedBusinessId || ''}
                  onChange={e => setSelectedBusinessId(e.target.value || null)}
                >
                  <option value="">None</option>
                  {businesses.map(business => (
                    <option key={business.id} value={business.id}>{business.business_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700" onClick={handleAdd}>Add Chatbot</button>
                <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </div>
          )}
          {/* Chatbots List */}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Chatbots</h2>
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 mb-4">Loading chatbots...</p>
              </div>
            ) : chatbots.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No chatbots created yet.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Add Your First Chatbot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {chatbots.map((bot) => (
                  <div key={bot.id} className="bg-white rounded-lg shadow p-4 lg:p-6 flex flex-col items-center relative">
                    {/* Edit/Delete/Share Icon Buttons at Top Right */}
                    <div className="absolute top-3 right-3 flex gap-2 z-10 mb-2">
                      <button
                        className="text-gray-600 hover:text-green-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => setSelectedChatbotForSharing(bot)}
                        aria-label="Share chatbot"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-blue-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => {
                          const b = bot as any;
                          setEditingId(bot.id);
                          setFormData({ 
                            ...bot,
                            knowledgeSources: b.knowledge_sources || [],
                            manualEntries: b.manual_entries || [''],
                            prompts: b.prompts || [''],
                            primaryColor: b.primary_color || defaultColorPairs[0].primary,
                            secondaryColor: b.secondary_color || defaultColorPairs[0].secondary,
                            languages: (b.languages && b.languages.length > 0) ? b.languages : ['English'],
                          });
                          setSelectedBusinessId(bot.business_id || null);
                        }}
                        aria-label="Edit chatbot"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => handleDelete(bot.id)}
                        aria-label="Delete chatbot"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <ChatbotPreview 
                      config={{ 
                        ...bot, 
                        avatar: bot.avatar_url || CHATBOT_IMAGE_URL, 
                        primaryColor: (bot as any).primaryColor || (bot as any).primary_color || defaultColorPairs[0].primary, 
                        secondaryColor: (bot as any).secondaryColor || (bot as any).secondary_color || defaultColorPairs[0].secondary 
                      }}
                      businessInfo={
                        ((bot as any).knowledge_sources || []).includes('Business Vault') && (bot as any).business_id
                          ? businesses.find(b => b.id === (bot as any).business_id)
                          : undefined
                      }
                    />
                    <button
                      className="mt-4 bg-gray-100 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded transition-colors w-full"
                      onClick={() => setHistoryChatbotId(bot.id)}
                    >
                      View Conversation History
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {historyChatbotId && (
        <ConversationHistory
          chatbotId={historyChatbotId}
          onClose={() => setHistoryChatbotId(null)}
        />
      )}
      {selectedChatbotForSharing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setSelectedChatbotForSharing(null)}
            >
              &times;
            </button>
            <SharingControls 
              chatbotId={selectedChatbotForSharing.id}
              chatbotName={selectedChatbotForSharing.name}
            />
          </div>
        </div>
      )}
    </div>
  );
} 