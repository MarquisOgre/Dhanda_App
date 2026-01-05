import { Shield, Calendar } from "lucide-react";
import { LICENSE_CONFIG, getDaysRemaining, formatExpiryDate, isLicenseValid } from "@/lib/license";
import { cn } from "@/lib/utils";

export function Footer() {
  const daysRemaining = getDaysRemaining();
  const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[hsl(199,89%,48%)] to-[hsl(172,66%,50%)] text-white py-3 px-6 z-40">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm max-w-screen-2xl mx-auto">
        {/* Left - Branding */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Dhanda App</span>
          <span className="text-white/70">•</span>
          <span className="text-white/90">Business Accounting Software</span>
        </div>

        {/* Center - License Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>{LICENSE_CONFIG.licenseType} License</span>
          </div>
          <span className="text-white/50">|</span>
          <div className={cn(
            "flex items-center gap-1.5",
            isExpiringSoon && "text-yellow-200 font-medium"
          )}>
            <Calendar className="w-4 h-4" />
            {isLicenseValid() ? (
              isExpiringSoon ? (
                <span>Expires in {daysRemaining} days</span>
              ) : (
                <span>Valid until {formatExpiryDate()}</span>
              )
            ) : (
              <span className="text-red-200">Expired</span>
            )}
          </div>
        </div>

        {/* Right - Copyright */}
        <div className="text-white/70 text-xs">
          © {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    </footer>
  );
}
