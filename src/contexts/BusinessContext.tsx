import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BusinessSettings {
  business_name: string | null;
  gstin: string | null;
  pan: string | null;
  email: string | null;
  phone: string | null;
  business_address: string | null;
  invoice_prefix: string | null;
  invoice_terms: string | null;
  logo_url: string | null;
}

interface BusinessContextType {
  businessSettings: BusinessSettings | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching business settings:', error);
      }

      if (data) {
        setBusinessSettings(data);
      }
    } catch (error) {
      console.error('Error fetching business settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const refetch = async () => {
    await fetchSettings();
  };

  return (
    <BusinessContext.Provider value={{ businessSettings, loading, refetch }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessSettings() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessSettings must be used within a BusinessProvider');
  }
  return context;
}
