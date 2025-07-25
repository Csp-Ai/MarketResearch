import React, { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { useBusinessData } from '../hooks/useBusinessData';
import { Edit, Plus, Trash2, Save, X } from 'lucide-react';

export default function BusinessVault() {
  const { user, logout } = useAuth();
  const { businesses, loading, saveBusiness, updateBusiness, deleteBusiness } = useBusinessData();
  const [editingBusiness, setEditingBusiness] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    website_url: '',
    description: '',
    industry: ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEdit = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setFormData({
        business_name: business.business_name || '',
        website_url: business.website_url || '',
        description: business.description || '',
        industry: business.industry || ''
      });
      setEditingBusiness(businessId);
    }
  };

  const handleSave = async () => {
    setMessage(null);
    setErrorMessage(null);
    try {
      if (editingBusiness) {
        await updateBusiness(editingBusiness, formData);
        setEditingBusiness(null);
        setMessage('Business updated successfully!');
      } else if (showAddForm) {
        await saveBusiness(formData);
        setShowAddForm(false);
        setMessage('Business added successfully!');
      }
      setFormData({
        business_name: '',
        website_url: '',
        description: '',
        industry: ''
      });
    } catch (err: any) {
      setErrorMessage('Failed to save business. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingBusiness(null);
    setShowAddForm(false);
    setFormData({
      business_name: '',
      website_url: '',
      description: '',
      industry: ''
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Business Vault</h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Manage your business information and AI agent configurations.
            </p>
          </div>

          {/* Add Business Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Business</span>
            </button>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editingBusiness) && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingBusiness ? 'Edit Business' : 'Add New Business'}
              </h3>
              {message && <div className="mb-2 text-green-600 font-medium">{message}</div>}
              {errorMessage && <div className="mb-2 text-red-600 font-medium">{errorMessage}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* Business List */}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Your Businesses</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading businesses...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 lg:p-8 text-center">
                <p className="text-gray-500 mb-4">No businesses added yet.</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Add Your First Business
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {businesses.map((business) => (
                  <div key={business.id} className="bg-white rounded-lg shadow p-4 lg:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {business.business_name}
                        </h3>
                        <p className="text-gray-600 text-sm">{business.website_url}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(business.id)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteBusiness(business.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {business.description && (
                      <p className="text-gray-700 text-sm mb-3">{business.description}</p>
                    )}
                    {business.industry && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Industry:</span> {business.industry}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">AI Agents Active</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Last Updated</span>
                        <span className="font-medium">
                          {business.updated_at ? new Date(business.updated_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 