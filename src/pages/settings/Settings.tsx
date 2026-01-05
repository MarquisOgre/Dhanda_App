import { useState, useEffect } from "react";
import { 
  Building2, 
  User, 
  FileText, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Printer,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessSettings } from "@/contexts/BusinessContext";
import { toast } from "sonner";

export default function Settings() {
  const { user, role, isAdmin } = useAuth();
  const { refetch: refetchBusiness } = useBusinessSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Business settings
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [invoiceTerms, setInvoiceTerms] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setBusinessName(data.business_name || "");
        setGstin(data.gstin || "");
        setPan(data.pan || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.business_address || "");
        setInvoicePrefix(data.invoice_prefix || "INV-");
        setInvoiceTerms(data.invoice_terms || "");
        setLogoUrl(data.logo_url || "");
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    if (!isAdmin) {
      toast.error('Only admins can modify settings');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user.id,
          business_name: businessName,
          gstin: gstin,
          pan: pan,
          email: email,
          phone: phone,
          business_address: address,
          invoice_prefix: invoicePrefix,
          invoice_terms: invoiceTerms,
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Refetch business settings to update sidebar
      await refetchBusiness();
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your business preferences</p>
        </div>
        <Button 
          className="btn-gradient gap-2" 
          onClick={handleSave}
          disabled={saving || !isAdmin}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      {!isAdmin && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 px-4 py-3 rounded-lg">
          Only admins can modify settings. You have view-only access.
        </div>
      )}

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden md:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Invoice</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden md:inline">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="print" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">Print</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden md:inline">Theme</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29ABCDE1234F1Z5"
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input
                    id="pan"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="ABCDE1234F"
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Business Logo" className="max-h-24 mx-auto mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    )}
                    <p className="text-sm text-muted-foreground">Click to upload logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  disabled={!isAdmin}
                />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Financial Year</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Financial Year Start</Label>
                <Select defaultValue="april" disabled={!isAdmin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current FY</Label>
                <Input value="2024-25" readOnly className="bg-muted" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Invoice Settings */}
        <TabsContent value="invoice" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Invoice Numbering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Prefix</Label>
                <Input 
                  value={invoicePrefix} 
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label>Next Invoice Number</Label>
                <Input type="number" defaultValue="156" disabled={!isAdmin} />
              </div>
              <div className="space-y-2">
                <Label>Estimation Prefix</Label>
                <Input defaultValue="EST-" disabled={!isAdmin} />
              </div>
              <div className="space-y-2">
                <Label>Purchase Bill Prefix</Label>
                <Input defaultValue="PUR-" disabled={!isAdmin} />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Default Terms</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea
                  rows={4}
                  value={invoiceTerms}
                  onChange={(e) => setInvoiceTerms(e.target.value)}
                  placeholder="1. Goods once sold will not be taken back.&#10;2. Payment due within 30 days.&#10;3. Interest @18% will be charged on overdue payments."
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Payment Terms</Label>
                <Select defaultValue="30" disabled={!isAdmin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on Receipt</SelectItem>
                    <SelectItem value="7">Net 7 Days</SelectItem>
                    <SelectItem value="15">Net 15 Days</SelectItem>
                    <SelectItem value="30">Net 30 Days</SelectItem>
                    <SelectItem value="45">Net 45 Days</SelectItem>
                    <SelectItem value="60">Net 60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">GST Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST Registration Type</Label>
                <Select defaultValue="regular" disabled={!isAdmin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="composition">Composition</SelectItem>
                    <SelectItem value="unregistered">Unregistered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select defaultValue="karnataka" disabled={!isAdmin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Default Tax Rates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 5, 12, 18, 28].map((rate) => (
                <div key={rate} className="flex items-center space-x-2">
                  <Switch id={`tax-${rate}`} defaultChecked={rate === 18} disabled={!isAdmin} />
                  <Label htmlFor={`tax-${rate}`}>{rate}% GST</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">TCS/TDS Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable TCS</p>
                  <p className="text-sm text-muted-foreground">Tax Collected at Source</p>
                </div>
                <Switch disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable TDS</p>
                  <p className="text-sm text-muted-foreground">Tax Deducted at Source</p>
                </div>
                <Switch disabled={!isAdmin} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Print Settings */}
        <TabsContent value="print" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Print Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Select defaultValue="a4" disabled={!isAdmin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="a5">A5</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="thermal">Thermal (3 inch)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Invoice Template</Label>
                <Select defaultValue="modern" disabled={!isAdmin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Print Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Logo on Invoice</p>
                  <p className="text-sm text-muted-foreground">Display business logo on printed invoices</p>
                </div>
                <Switch defaultChecked disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Bank Details</p>
                  <p className="text-sm text-muted-foreground">Print bank account details on invoices</p>
                </div>
                <Switch defaultChecked disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show QR Code</p>
                  <p className="text-sm text-muted-foreground">Display UPI QR code for payments</p>
                </div>
                <Switch disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Print on Save</p>
                  <p className="text-sm text-muted-foreground">Automatically open print dialog when saving</p>
                </div>
                <Switch disabled={!isAdmin} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Reminders</p>
                  <p className="text-sm text-muted-foreground">Send reminders for pending payments</p>
                </div>
                <Switch defaultChecked disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify when items are running low</p>
                </div>
                <Switch defaultChecked disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">Receive daily sales summary</p>
                </div>
                <Switch disabled={!isAdmin} />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">System Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overdue Invoices</p>
                  <p className="text-sm text-muted-foreground">Alert for overdue invoices</p>
                </div>
                <Switch defaultChecked disabled={!isAdmin} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Order Received</p>
                  <p className="text-sm text-muted-foreground">Notify on new orders</p>
                </div>
                <Switch defaultChecked disabled={!isAdmin} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">User Roles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage user access levels. Admins have full access, Supervisors can create/edit data, Viewers can only view.
            </p>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-sm text-muted-foreground capitalize">Role: {role}</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full capitalize">
                  {role}
                </span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Role Permissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Permission</th>
                    <th className="text-center py-2 px-4">Admin</th>
                    <th className="text-center py-2 px-4">Supervisor</th>
                    <th className="text-center py-2 px-4">Viewer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">View Data</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Create/Edit Records</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">—</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Delete Records</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">—</td>
                    <td className="text-center py-2 px-4">—</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Manage Settings</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">—</td>
                    <td className="text-center py-2 px-4">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Reset Database</td>
                    <td className="text-center py-2 px-4">✓</td>
                    <td className="text-center py-2 px-4">—</td>
                    <td className="text-center py-2 px-4">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Password Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </div>
              <Button variant="outline">Update Password</Button>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Session Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Logout</p>
                  <p className="text-sm text-muted-foreground">Automatically logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary">
                <div className="w-full h-16 bg-background border rounded mb-2"></div>
                <p className="text-sm">Light</p>
              </div>
              <div className="border rounded-lg p-4 text-center cursor-pointer border-primary">
                <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                <p className="text-sm">Dark</p>
              </div>
              <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary">
                <div className="w-full h-16 bg-gradient-to-r from-background to-gray-900 rounded mb-2"></div>
                <p className="text-sm">System</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Accent Color</h3>
            <div className="flex gap-4">
              {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Display</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sidebar Collapsed</p>
                  <p className="text-sm text-muted-foreground">Start with collapsed sidebar</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
