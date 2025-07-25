import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserBusiness, BusinessProfile } from '../types/business';
import { useAuth } from './useAuth';

export const useBusinessData = () => {
  const [businesses, setBusinesses] = useState<UserBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBusinesses = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBusinesses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveBusiness = async (businessData: {
    business_name: string;
    website_url: string;
    description?: string;
    industry?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          business_name: businessData.business_name,
          website_url: businessData.website_url || null,
          description: businessData.description || null,
          industry: businessData.industry || null
        })
        .select()
        .single();

      if (error) throw error;
      
      setBusinesses(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateBusiness = async (businessId: string, updates: Partial<UserBusiness>) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', businessId)
        .select()
        .single();

      if (error) throw error;
      
      setBusinesses(prev => 
        prev.map(business => 
          business.id === businessId ? data : business
        )
      );
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (error) throw error;
      
      setBusinesses(prev => prev.filter(business => business.id !== businessId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBusinesses();
    }
  }, [user]);

  return {
    businesses,
    loading,
    error,
    saveBusiness,
    updateBusiness,
    deleteBusiness,
    fetchBusinesses
  };
}; 