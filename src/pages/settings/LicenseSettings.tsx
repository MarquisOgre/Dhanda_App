import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Shield, Phone, Mail, MessageCircle, Save, AlertTriangle, Users, UserCheck, CreditCard } from "lucide-react";
import { useLicenseSettings } from "@/hooks/useLicenseSettings";
import { useBusinessSettings } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";

interface LicensePlan {
  id: string;
  plan_name: string;
  duration_days: number;
  price: number;
  is_active: boolean;
}

export function LicenseSettings() {
  const { licenseSettings, isLoading, updateLicenseSettings, getDaysRemaining, formatExpiryDate, isLicenseValid } = useLicenseSettings();
  const { businessSettings } = useBusinessSettings();
  const { user } = useAuth();
  const isSuperAdmin = user?.email === 'marquisogre@gmail.com';
  
  const [plans, setPlans] = useState<LicensePlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [formData, setFormData] = useState({
    expiry_date: "",
    license_type: "",
    licensed_to: "",
    support_email: "",
    support_phone: "",
    support_whatsapp: "",
    max_users: 5,
    max_simultaneous_logins: 3,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (licenseSettings) {
      setFormData({
        expiry_date: licenseSettings.expiry_date || "",
        license_type: licenseSettings.license_type || "",
        licensed_to: licenseSettings.licensed_to || "",
        support_email: licenseSettings.support_email || "",
        support_phone: licenseSettings.support_phone || "",
        support_whatsapp: licenseSettings.support_whatsapp || "",
        max_users: (licenseSettings as any).max_users || 5,
        max_simultaneous_logins: (licenseSettings as any).max_simultaneous_logins || 3,
      });
    }
  }, [licenseSettings]);

  // Set licensed_to from business name if empty
  useEffect(() => {
    if (businessSettings?.business_name && !formData.licensed_to) {
      setFormData(prev => ({ ...prev, licensed_to: businessSettings.business_name || "" }));
    }
  }, [businessSettings?.business_name]);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("license_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (data) setPlans(data);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const newExpiryDate = addDays(new Date(), plan.duration_days);
      setFormData(prev => ({
        ...prev,
        expiry_date: format(newExpiryDate, "yyyy-MM-dd"),
        license_type: plan.plan_name,
        licensed_to: businessSettings?.business_name || prev.licensed_to,
      }));
    }
  };

  const handleSave = () => {
    updateLicenseSettings.mutate(formData);
  };

  const daysRemaining = getDaysRemaining();
  const valid = isLicenseValid();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          License Management
        </CardTitle>
        <CardDescription>
          Manage application license and validity settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* License Status - Visible to all users */}
        <div className={`p-4 rounded-lg border ${valid ? (daysRemaining <= 30 ? 'bg-warning/10 border-warning/30' : 'bg-success/10 border-success/30') : 'bg-destructive/10 border-destructive/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!valid ? (
                <AlertTriangle className="w-8 h-8 text-destructive" />
              ) : daysRemaining <= 30 ? (
                <AlertTriangle className="w-8 h-8 text-warning" />
              ) : (
                <Shield className="w-8 h-8 text-success" />
              )}
              <div>
                <p className="font-semibold">
                  {!valid ? 'License Expired' : daysRemaining <= 30 ? 'License Expiring Soon' : 'License Active'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {valid ? `${daysRemaining} days remaining • Expires ${formatExpiryDate()}` : `Expired on ${formatExpiryDate()}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{valid ? daysRemaining : 0}</p>
              <p className="text-xs text-muted-foreground">Days Left</p>
            </div>
          </div>
        </div>

        {/* Editable Fields - Only visible to super admin */}
        {isSuperAdmin && (
          <>
            {/* Plan Selection */}
            <div className="p-4 rounded-lg border bg-muted/20">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="w-4 h-4" />
                  Assign License Plan
                </Label>
                <Select value={selectedPlanId} onValueChange={handlePlanSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a license plan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.plan_name} - {plan.duration_days} Days {plan.price > 0 ? `(₹${plan.price.toLocaleString()})` : "(Free)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Selecting a plan will automatically update the expiry date and license type
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiry_date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expiry Date
                </Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_type">License Type</Label>
                <Input
                  id="license_type"
                  value={formData.license_type}
                  onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensed_to">Licensed To</Label>
                <Input
                  id="licensed_to"
                  value={formData.licensed_to}
                  onChange={(e) => setFormData({ ...formData, licensed_to: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Support Email
                </Label>
                <Input
                  id="support_email"
                  type="email"
                  value={formData.support_email}
                  onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Support Phone
                </Label>
                <Input
                  id="support_phone"
                  value={formData.support_phone}
                  onChange={(e) => setFormData({ ...formData, support_phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Number
                </Label>
                <Input
                  id="support_whatsapp"
                  placeholder="+919876543210"
                  value={formData.support_whatsapp}
                  onChange={(e) => setFormData({ ...formData, support_whatsapp: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_users" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Maximum Users Allowed
                </Label>
                <Input
                  id="max_users"
                  type="number"
                  min="1"
                  value={formData.max_users}
                  onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">Total number of users that can be created for this license</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_simultaneous_logins" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Simultaneous Logins
                </Label>
                <Input
                  id="max_simultaneous_logins"
                  type="number"
                  min="1"
                  value={formData.max_simultaneous_logins}
                  onChange={(e) => setFormData({ ...formData, max_simultaneous_logins: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">Maximum number of users that can be logged in at the same time</p>
              </div>
            </div>

            <Button
              onClick={handleSave} 
              className="btn-gradient"
              disabled={updateLicenseSettings.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateLicenseSettings.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
