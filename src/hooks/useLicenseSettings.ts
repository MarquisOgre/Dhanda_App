import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LicenseSettings {
  id: string;
  expiry_date: string;
  license_type: string;
  licensed_to: string | null;
  support_email: string | null;
  support_phone: string | null;
  support_whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export function useLicenseSettings() {
  const queryClient = useQueryClient();

  const { data: licenseSettings, isLoading } = useQuery({
    queryKey: ["license-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("license_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching license settings:", error);
        return null;
      }
      return data as LicenseSettings;
    },
  });

  const updateLicenseSettings = useMutation({
    mutationFn: async (updates: Partial<LicenseSettings>) => {
      if (!licenseSettings?.id) throw new Error("No license settings found");
      
      const { error } = await supabase
        .from("license_settings")
        .update(updates)
        .eq("id", licenseSettings.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["license-settings"] });
      toast.success("License settings updated successfully");
    },
    onError: (error) => {
      console.error("Error updating license settings:", error);
      toast.error("Failed to update license settings");
    },
  });

  const isLicenseValid = () => {
    if (!licenseSettings) return true; // Default to valid if not loaded
    const expiryDate = new Date(licenseSettings.expiry_date);
    return new Date() <= expiryDate;
  };

  const getDaysRemaining = () => {
    if (!licenseSettings) return 999;
    const expiryDate = new Date(licenseSettings.expiry_date);
    const diff = expiryDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatExpiryDate = () => {
    if (!licenseSettings) return "";
    return new Date(licenseSettings.expiry_date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return {
    licenseSettings,
    isLoading,
    updateLicenseSettings,
    isLicenseValid,
    getDaysRemaining,
    formatExpiryDate,
  };
}
