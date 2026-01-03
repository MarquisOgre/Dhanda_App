import { useState } from "react";
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
  Plus
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

export default function Settings() {
  const [businessName, setBusinessName] = useState("My Business");
  const [gstNumber, setGstNumber] = useState("29ABCDE1234F1Z5");
  const [email, setEmail] = useState("business@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123 Business Street, City, State - 560001");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your business preferences</p>
        </div>
        <Button className="btn-gradient gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select defaultValue="retailer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="service">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
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
                />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Financial Year</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Financial Year Start</Label>
                <Select defaultValue="april">
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
                <Input defaultValue="INV-" />
              </div>
              <div className="space-y-2">
                <Label>Next Invoice Number</Label>
                <Input type="number" defaultValue="156" />
              </div>
              <div className="space-y-2">
                <Label>Estimation Prefix</Label>
                <Input defaultValue="EST-" />
              </div>
              <div className="space-y-2">
                <Label>Purchase Bill Prefix</Label>
                <Input defaultValue="PUR-" />
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
                  defaultValue="1. Goods once sold will not be taken back.
2. Payment due within 30 days.
3. Interest @18% will be charged on overdue payments."
                />
              </div>
              <div className="space-y-2">
                <Label>Default Payment Terms</Label>
                <Select defaultValue="30">
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
                <Select defaultValue="regular">
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
                <Select defaultValue="karnataka">
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
                  <Switch id={`tax-${rate}`} defaultChecked={rate === 18} />
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
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable TDS</p>
                  <p className="text-sm text-muted-foreground">Tax Deducted at Source</p>
                </div>
                <Switch />
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
                <Select defaultValue="a4">
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
                <Select defaultValue="modern">
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Bank Details</p>
                  <p className="text-sm text-muted-foreground">Print bank account details on invoices</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show QR Code</p>
                  <p className="text-sm text-muted-foreground">Display UPI QR code for payments</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Print on Save</p>
                  <p className="text-sm text-muted-foreground">Automatically open print dialog when saving</p>
                </div>
                <Switch />
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify when items are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">Receive daily sales summary</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Stock Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Low Stock Threshold</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label>Alert Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="space-y-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Team Members</h3>
              <Button className="btn-gradient gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Admin User", email: "admin@business.com", role: "Admin" },
                { name: "Sales Manager", email: "sales@business.com", role: "Manager" },
                { name: "Accountant", email: "accounts@business.com", role: "Accountant" },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Password & Authentication</h3>
            <div className="space-y-4">
              <Button variant="outline">Change Password</Button>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
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
              <button className="p-4 rounded-lg border-2 border-primary bg-background text-center">
                <div className="w-full h-20 rounded bg-background border mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button className="p-4 rounded-lg border-2 border-border bg-background text-center">
                <div className="w-full h-20 rounded bg-zinc-900 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button className="p-4 rounded-lg border-2 border-border bg-background text-center">
                <div className="w-full h-20 rounded bg-gradient-to-b from-background to-zinc-900 mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Accent Color</h3>
            <div className="flex gap-3">
              {["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
