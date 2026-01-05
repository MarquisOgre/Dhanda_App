import { AlertTriangle, Mail, Phone, Calendar, Shield, RefreshCw } from "lucide-react";
import { LICENSE_CONFIG, formatExpiryDate } from "@/lib/license";
import { Button } from "@/components/ui/button";

export function LicenseExpired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-destructive/90 to-warning/90 p-8 text-white text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">License Expired</h1>
            <p className="text-white/90">Your subscription has ended</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Expiry Info */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-destructive mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Expired on</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatExpiryDate()}</p>
            </div>

            {/* License Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">License Type</span>
                </div>
                <p className="font-semibold">{LICENSE_CONFIG.licenseType}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Status</span>
                </div>
                <p className="font-semibold text-destructive">Inactive</p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
              <h3 className="font-semibold text-lg mb-4 text-center">Contact System Administrator</h3>
              <p className="text-muted-foreground text-center mb-6">
                To renew your license and continue using Dhanda App, please contact our support team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`mailto:${LICENSE_CONFIG.supportEmail}`}>
                  <Button className="btn-gradient gap-2 w-full sm:w-auto">
                    <Mail className="w-4 h-4" />
                    {LICENSE_CONFIG.supportEmail}
                  </Button>
                </a>
                <a href={`tel:${LICENSE_CONFIG.supportPhone.replace(/\s/g, "")}`}>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Phone className="w-4 h-4" />
                    {LICENSE_CONFIG.supportPhone}
                  </Button>
                </a>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-center text-sm text-muted-foreground">
              Your data is safe and will be accessible once the license is renewed.
            </p>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center mt-6">
          <img src="/logo.png" alt="Dhanda App" className="h-8 mx-auto opacity-50" />
        </div>
      </div>
    </div>
  );
}
