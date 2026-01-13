import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAutoLogout() {
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Sign out when window/tab is closed
      await supabase.auth.signOut();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Store timestamp when page becomes hidden
        sessionStorage.setItem('lastActive', Date.now().toString());
      }
    };

    // Listen for page unload events
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check if coming back after being closed
    const lastActive = sessionStorage.getItem('lastActive');
    if (lastActive) {
      const timeDiff = Date.now() - parseInt(lastActive);
      // If more than 30 seconds have passed (indicating window was closed and reopened)
      if (timeDiff > 30000) {
        supabase.auth.signOut();
      }
      sessionStorage.removeItem('lastActive');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
