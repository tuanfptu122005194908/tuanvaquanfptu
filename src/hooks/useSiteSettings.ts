import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  banner_url?: string;
  payment_qr_url?: string;
  [key: string]: string | undefined;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: SiteSettings = {};
      (data || []).forEach((item: any) => {
        if (item.value) {
          settingsMap[item.key] = item.value;
        }
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, isLoading, refetch: fetchSettings };
}
