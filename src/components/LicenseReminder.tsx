import { useState, useEffect } from "react";
import { X, AlertTriangle, Calendar, Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLicenseSettings } from "@/hooks/useLicenseSettings";

const DISMISS_KEY = "license_reminder_dismissed";

export function LicenseReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const { licenseSettings, isLoading, getDaysRemaining, formatExpiryDate, isLicenseValid } = useLicenseSettings();
  const daysRemaining = getDaysRemaining();

  useEffect(() => {
    if (isLoading) return;
    
    // Show reminder if license is valid but expiring within 7 days
    if (isLicenseValid() && daysRemaining <= 7 && daysRemaining > 0) {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      const dismissedDate = dismissed ? new Date(dismissed) : null;
      const today = new Date().toDateString();

      // Only show if not dismissed today
      if (!dismissedDate || dismissedDate.toDateString() !== today) {
        setIsVisible(true);
      }
    }
  }, [daysRemaining, isLoading, isLicenseValid]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-border animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-warning to-warning/80 p-6 text-white relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">License Expiring Soon!</h2>
              <p className="text-white/90 text-sm">Action required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Days Counter */}
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-center">
            <p className="text-4xl font-bold text-warning">{daysRemaining}</p>
            <p className="text-sm text-muted-foreground">days remaining</p>
          </div>

          {/* Expiry Date */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Expires on {formatExpiryDate()}</span>
          </div>

          {/* Message */}
          <p className="text-center text-muted-foreground text-sm">
            Your {licenseSettings?.license_type || 'Professional'} license is about to expire. 
            Please contact the system administrator to renew and avoid any interruption.
          </p>

          {/* Contact Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <a href={`mailto:${licenseSettings?.support_email || 'support@dhandaapp.com'}`} className="block">
              <Button variant="outline" className="w-full gap-1 text-xs px-2">
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </a>
            <a href={`tel:${(licenseSettings?.support_phone || '+919876543210').replace(/\s/g, "")}`} className="block">
              <Button variant="outline" className="w-full gap-1 text-xs px-2">
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </a>
            <a 
              href={`https://wa.me/${(licenseSettings?.support_whatsapp || '+919876543210').replace(/[^0-9]/g, "")}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full gap-1 text-xs px-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Dismiss Button */}
          <Button 
            className="w-full btn-gradient" 
            onClick={handleDismiss}
          >
            Remind Me Later
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            This reminder will appear once per day
          </p>
        </div>
      </div>
    </div>
  );
}
