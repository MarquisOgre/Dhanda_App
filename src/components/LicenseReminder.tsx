import { useState, useEffect } from "react";
import { X, AlertTriangle, Calendar, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LICENSE_CONFIG, getDaysRemaining, formatExpiryDate, isLicenseValid } from "@/lib/license";

const DISMISS_KEY = "license_reminder_dismissed";

export function LicenseReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const daysRemaining = getDaysRemaining();

  useEffect(() => {
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
  }, [daysRemaining]);

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
            Your {LICENSE_CONFIG.licenseType} license is about to expire. 
            Please contact the system administrator to renew and avoid any interruption.
          </p>

          {/* Contact Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`mailto:${LICENSE_CONFIG.supportEmail}`} className="block">
              <Button variant="outline" className="w-full gap-2 text-xs">
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
            </a>
            <a href={`tel:${LICENSE_CONFIG.supportPhone.replace(/\s/g, "")}`} className="block">
              <Button variant="outline" className="w-full gap-2 text-xs">
                <Phone className="w-4 h-4" />
                Call Support
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
