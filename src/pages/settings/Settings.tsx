import { useState, useEffect, useRef } from "react";
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
  Loader2,
  UserPlus,
  Trash2,
  Check,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Plus,
  Ruler
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessSettings } from "@/contexts/BusinessContext";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { LicenseSettings } from "./LicenseSettings";
import { checkMaxUsers } from "@/hooks/useSessionTracking";

type AppRole = 'admin' | 'supervisor' | 'viewer';

interface UnitOfMeasure {
  id: string;
  name: string;
  symbol: string | null;
  is_default: boolean;
}

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
}

// All Indian states and union territories
const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OR", name: "Odisha" },
  { code: "PY", name: "Puducherry" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TG", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
];

const ACCENT_COLORS = [
  { name: 'Blue', value: '199 89% 48%' },
  { name: 'Green', value: '142 76% 36%' },
  { name: 'Purple', value: '262 83% 58%' },
  { name: 'Orange', value: '38 92% 50%' },
  { name: 'Red', value: '0 84% 60%' },
  { name: 'Pink', value: '330 81% 60%' },
];

export default function Settings() {
  const { user, role, isAdmin } = useAuth();
  const { refetch: refetchBusiness, getCurrentFinancialYear } = useBusinessSettings();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
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
  const [financialYearStart, setFinancialYearStart] = useState("april");

  // Invoice settings
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState(1);
  const [estimationPrefix, setEstimationPrefix] = useState("EST-");
  const [purchasePrefix, setPurchasePrefix] = useState("PUR-");
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState("30");

  // Tax settings
  const [gstRegistrationType, setGstRegistrationType] = useState("regular");
  const [stateCode, setStateCode] = useState("KA");
  const [defaultTaxRate, setDefaultTaxRate] = useState(0);
  const [enableTcs, setEnableTcs] = useState(false);
  const [enableTds, setEnableTds] = useState(false);
  const [tcsPercent, setTcsPercent] = useState(1);
  const [tdsPercent, setTdsPercent] = useState(2);

  // Print settings
  const [paperSize, setPaperSize] = useState("a4");
  const [invoiceTemplate, setInvoiceTemplate] = useState("modern");
  const [showLogoOnInvoice, setShowLogoOnInvoice] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [showQrCode, setShowQrCode] = useState(false);
  const [autoPrintOnSave, setAutoPrintOnSave] = useState(false);

  // User management
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("viewer");
  const [addingUser, setAddingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Units of measure
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitSymbol, setNewUnitSymbol] = useState("");
  const [addingUnit, setAddingUnit] = useState(false);

  // Display preferences (stored in localStorage)
  const [autoLogoutTime, setAutoLogoutTime] = useState("30");
  const [accentColor, setAccentColor] = useState("199 89% 48%");
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchSettings();
    loadDisplayPreferences();
    fetchUnits();
    if (isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const loadDisplayPreferences = () => {
    const savedAutoLogout = localStorage.getItem('autoLogoutTime');
    const savedAccentColor = localStorage.getItem('accentColor');
    const savedCompactMode = localStorage.getItem('compactMode');
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed');

    if (savedAutoLogout) setAutoLogoutTime(savedAutoLogout);
    if (savedAccentColor) setAccentColor(savedAccentColor);
    if (savedCompactMode) setCompactMode(savedCompactMode === 'true');
    if (savedSidebarCollapsed) setSidebarCollapsed(savedSidebarCollapsed === 'true');
  };

  const saveDisplayPreference = (key: string, value: string | boolean) => {
    localStorage.setItem(key, String(value));
    
    // Apply accent color immediately
    if (key === 'accentColor') {
      document.documentElement.style.setProperty('--primary', value as string);
    }
    
    // Apply compact mode
    if (key === 'compactMode') {
      document.documentElement.classList.toggle('compact', value as boolean);
    }
  };

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
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
        setFinancialYearStart(data.financial_year_start || "april");
        
        // Invoice settings
        setNextInvoiceNumber(data.next_invoice_number || 1);
        setEstimationPrefix(data.estimation_prefix || "EST-");
        setPurchasePrefix(data.purchase_prefix || "PUR-");
        setDefaultPaymentTerms(String(data.default_payment_terms || 30));
        
        // Tax settings
        setGstRegistrationType(data.gst_registration_type || "regular");
        setStateCode(data.state_code || "KA");
        setDefaultTaxRate(data.default_tax_rate ?? 0);
        setEnableTcs(data.enable_tcs || false);
        setEnableTds(data.enable_tds || false);
        setTcsPercent(data.tcs_percent ?? 1);
        setTdsPercent(data.tds_percent ?? 2);

        // Print settings
        setPaperSize(data.paper_size || "a4");
        setInvoiceTemplate(data.invoice_template || "modern");
        setShowLogoOnInvoice(data.show_logo_on_invoice ?? true);
        setShowBankDetails(data.show_bank_details ?? true);
        setShowQrCode(data.show_qr_code || false);
        setAutoPrintOnSave(data.auto_print_on_save || false);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    if (!user) return;
    setLoadingUnits(true);
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      
      // If no units exist, create default "Bottles" unit
      if (!data || data.length === 0) {
        const { data: newUnit, error: insertError } = await supabase
          .from('units')
          .insert({
            user_id: user.id,
            name: 'Bottles',
            symbol: 'Btl',
            is_default: true
          })
          .select()
          .single();
        
        if (!insertError && newUnit) {
          setUnits([newUnit]);
        }
      } else {
        setUnits(data);
      }
    } catch (error: any) {
      console.error('Error fetching units:', error);
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleAddUnit = async () => {
    if (!newUnitName.trim() || !user) {
      toast.error('Please enter a unit name');
      return;
    }

    setAddingUnit(true);
    try {
      const { data, error } = await supabase
        .from('units')
        .insert({
          user_id: user.id,
          name: newUnitName.trim(),
          symbol: newUnitSymbol.trim() || null,
          is_default: false
        })
        .select()
        .single();

      if (error) throw error;

      setUnits([...units, data]);
      setNewUnitName("");
      setNewUnitSymbol("");
      toast.success('Unit added successfully');
    } catch (error: any) {
      console.error('Error adding unit:', error);
      toast.error('Failed to add unit');
    } finally {
      setAddingUnit(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', unitId);

      if (error) throw error;

      setUnits(units.filter(u => u.id !== unitId));
      toast.success('Unit deleted');
    } catch (error: any) {
      console.error('Error deleting unit:', error);
      toast.error('Failed to delete unit');
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name');

      if (profilesError) throw profilesError;

      const usersWithRoles: UserWithRole[] = rolesData
        .map(roleItem => {
          const profile = profilesData.find(p => p.user_id === roleItem.user_id);
          return {
            user_id: roleItem.user_id,
            email: profile?.email || 'Unknown',
            full_name: profile?.full_name || null,
            role: roleItem.role as AppRole
          };
        })
        // Hide superadmin from user list
        .filter(u => u.email !== 'marquisogre@gmail.com');

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error('Only PNG, JPG, and WebP images are allowed');
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      const newLogoUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setLogoUrl(newLogoUrl);
      toast.success('Logo uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo: ' + error.message);
    } finally {
      setUploadingLogo(false);
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
          financial_year_start: financialYearStart,
          next_invoice_number: nextInvoiceNumber,
          estimation_prefix: estimationPrefix,
          purchase_prefix: purchasePrefix,
          default_payment_terms: parseInt(defaultPaymentTerms),
          gst_registration_type: gstRegistrationType,
          state_code: stateCode,
          default_tax_rate: defaultTaxRate,
          enable_tcs: enableTcs,
          enable_tds: enableTds,
          tcs_percent: tcsPercent,
          tds_percent: tdsPercent,
          paper_size: paperSize,
          invoice_template: invoiceTemplate,
          show_logo_on_invoice: showLogoOnInvoice,
          show_bank_details: showBankDetails,
          show_qr_code: showQrCode,
          auto_print_on_save: autoPrintOnSave,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      await refetchBusiness();
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !newUserPassword.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setAddingUser(true);
    try {
      // Check max users limit before adding
      const { allowed, error: limitError } = await checkMaxUsers();
      if (!allowed) {
        toast.error(limitError || 'User limit reached');
        setAddingUser(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail.trim(),
        password: newUserPassword,
        options: {
          data: {
            full_name: newUserName.trim() || null,
          },
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update the role if not viewer (viewer is default)
        if (newUserRole !== 'viewer') {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: newUserRole })
            .eq('user_id', data.user.id);

          if (roleError) {
            console.error('Error updating role:', roleError);
          }
        }
      }

      toast.success(`User ${newUserEmail} added successfully`);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      setNewUserRole("viewer");
      setAddUserDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered');
      } else {
        toast.error('Failed to add user: ' + error.message);
      }
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    setDeletingUserId(userId);
    try {
      // Delete user role first
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user: ' + error.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast.error('Failed to update role');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password: ' + error.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAutoLogoutChange = (value: string) => {
    setAutoLogoutTime(value);
    saveDisplayPreference('autoLogoutTime', value);
    toast.success(`Auto logout set to ${value === 'never' ? 'never' : value + ' minutes'}`);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    saveDisplayPreference('accentColor', color);
    toast.success('Accent color updated');
  };

  const handleCompactModeChange = (checked: boolean) => {
    setCompactMode(checked);
    saveDisplayPreference('compactMode', checked);
    toast.success(`Compact mode ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleSidebarCollapsedChange = (checked: boolean) => {
    setSidebarCollapsed(checked);
    saveDisplayPreference('sidebarCollapsed', checked);
    toast.success(`Sidebar will ${checked ? 'start collapsed' : 'start expanded'}`);
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
        <TabsList className="flex flex-wrap w-full h-auto gap-2 bg-transparent p-0">
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
          <TabsTrigger value="license" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">License</span>
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleLogoUpload}
                    disabled={!isAdmin || uploadingLogo}
                  />
                  <div 
                    className={`border-2 border-dashed border-border rounded-lg p-6 text-center ${isAdmin ? 'cursor-pointer hover:border-primary' : ''}`}
                    onClick={() => isAdmin && fileInputRef.current?.click()}
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    ) : logoUrl ? (
                      <img src={logoUrl} alt="Business Logo" className="max-h-24 mx-auto mb-2 object-contain" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {uploadingLogo ? 'Uploading...' : 'Click to upload logo'}
                    </p>
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
                <Select 
                  value={financialYearStart} 
                  onValueChange={setFinancialYearStart}
                  disabled={!isAdmin}
                >
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
                <Input value={getCurrentFinancialYear()} readOnly className="bg-muted" />
              </div>
            </div>
          </div>

          {/* Units of Measure */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Units of Measure
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add custom units to use across items and invoices
            </p>
            
            {/* Add new unit */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Unit name (e.g., Bottles)"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                disabled={!isAdmin || addingUnit}
                className="flex-1"
              />
              <Input
                placeholder="Symbol (e.g., Btl)"
                value={newUnitSymbol}
                onChange={(e) => setNewUnitSymbol(e.target.value)}
                disabled={!isAdmin || addingUnit}
                className="w-24"
              />
              <Button 
                onClick={handleAddUnit} 
                disabled={!isAdmin || addingUnit || !newUnitName.trim()}
                className="gap-1"
              >
                {addingUnit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </Button>
            </div>

            {/* Units list */}
            {loadingUnits ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : units.length === 0 ? (
              <p className="text-muted-foreground text-sm">No units added yet</p>
            ) : (
              <div className="space-y-2">
                {units.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">{unit.name}</span>
                      {unit.symbol && <span className="text-muted-foreground ml-2">({unit.symbol})</span>}
                      {unit.is_default && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    {isAdmin && !unit.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteUnit(unit.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                <Input 
                  type="number" 
                  value={nextInvoiceNumber}
                  onChange={(e) => setNextInvoiceNumber(parseInt(e.target.value) || 1)}
                  disabled={!isAdmin} 
                />
              </div>
              <div className="space-y-2">
                <Label>Estimation Prefix</Label>
                <Input 
                  value={estimationPrefix}
                  onChange={(e) => setEstimationPrefix(e.target.value)}
                  disabled={!isAdmin} 
                />
              </div>
              <div className="space-y-2">
                <Label>Purchase Bill Prefix</Label>
                <Input 
                  value={purchasePrefix}
                  onChange={(e) => setPurchasePrefix(e.target.value)}
                  disabled={!isAdmin} 
                />
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
                <Select 
                  value={defaultPaymentTerms} 
                  onValueChange={setDefaultPaymentTerms}
                  disabled={!isAdmin}
                >
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
                <Select 
                  value={gstRegistrationType} 
                  onValueChange={setGstRegistrationType}
                  disabled={!isAdmin}
                >
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
                <Select 
                  value={stateCode} 
                  onValueChange={setStateCode}
                  disabled={!isAdmin}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Default Tax Rate</h3>
            <p className="text-sm text-muted-foreground mb-4">Select your default GST rate for new items</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[0, 5, 12, 18, 28].map((rate) => (
                <div 
                  key={rate} 
                  className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                    defaultTaxRate === rate 
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                      : 'hover:border-primary/50'
                  } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => isAdmin && setDefaultTaxRate(rate)}
                >
                  <p className="text-lg font-semibold">{rate}%</p>
                  <p className="text-xs text-muted-foreground">GST</p>
                  {defaultTaxRate === rate && (
                    <Check className="w-4 h-4 text-primary mx-auto mt-2" />
                  )}
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
                  <p className="text-sm text-muted-foreground">Tax Collected at Source (for Sales)</p>
                </div>
                <Switch 
                  checked={enableTcs}
                  onCheckedChange={setEnableTcs}
                  disabled={!isAdmin} 
                />
              </div>
              {enableTcs && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label>TCS Rate (%)</Label>
                  <Input
                    type="number"
                    value={tcsPercent}
                    onChange={(e) => setTcsPercent(Number(e.target.value))}
                    className="w-32"
                    min={0}
                    max={100}
                    step={0.01}
                    disabled={!isAdmin}
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable TDS</p>
                  <p className="text-sm text-muted-foreground">Tax Deducted at Source (for Purchases)</p>
                </div>
                <Switch 
                  checked={enableTds}
                  onCheckedChange={setEnableTds}
                  disabled={!isAdmin} 
                />
              </div>
              {enableTds && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label>TDS Rate (%)</Label>
                  <Input
                    type="number"
                    value={tdsPercent}
                    onChange={(e) => setTdsPercent(Number(e.target.value))}
                    className="w-32"
                    min={0}
                    max={100}
                    step={0.01}
                    disabled={!isAdmin}
                  />
                </div>
              )}
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
                <Select 
                  value={paperSize} 
                  onValueChange={setPaperSize}
                  disabled={!isAdmin}
                >
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
                <Select 
                  value={invoiceTemplate} 
                  onValueChange={setInvoiceTemplate}
                  disabled={!isAdmin}
                >
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
                <Switch 
                  checked={showLogoOnInvoice}
                  onCheckedChange={setShowLogoOnInvoice}
                  disabled={!isAdmin} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Bank Details</p>
                  <p className="text-sm text-muted-foreground">Print bank account details on invoices</p>
                </div>
                <Switch 
                  checked={showBankDetails}
                  onCheckedChange={setShowBankDetails}
                  disabled={!isAdmin} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show QR Code</p>
                  <p className="text-sm text-muted-foreground">Display UPI QR code for payments</p>
                </div>
                <Switch 
                  checked={showQrCode}
                  onCheckedChange={setShowQrCode}
                  disabled={!isAdmin} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Print on Save</p>
                  <p className="text-sm text-muted-foreground">Automatically open print dialog when saving</p>
                </div>
                <Switch 
                  checked={autoPrintOnSave}
                  onCheckedChange={setAutoPrintOnSave}
                  disabled={!isAdmin} 
                />
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
                  <p className="text-sm text-muted-foreground">Receive daily business summary</p>
                </div>
                <Switch disabled={!isAdmin} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">User Management</h3>
              {isAdmin && (
                <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with specific access level.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="newUserName">Full Name</Label>
                        <Input
                          id="newUserName"
                          placeholder="John Doe"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserEmail">Email Address</Label>
                        <Input
                          id="newUserEmail"
                          type="email"
                          placeholder="user@example.com"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserPassword">Password</Label>
                        <Input
                          id="newUserPassword"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Access Level</Label>
                        <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as AppRole)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser} disabled={addingUser}>
                        {addingUser ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Add User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.user_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {u.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{u.full_name || u.email}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && u.user_id !== user?.id ? (
                        <>
                          <Select
                            value={u.role}
                            onValueChange={(v) => handleChangeRole(u.user_id, v as AppRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {u.email}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(u.user_id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingUserId === u.user_id ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  ) : null}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-primary/10 text-primary' :
                          u.role === 'supervisor' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          {u.user_id === user?.id && ' (You)'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Access Level Table */}
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Access Levels</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Supervisor</TableHead>
                  <TableHead className="text-center">Viewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>View Dashboard & Reports</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Create/Edit Invoices</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manage Items & Parties</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Record Payments</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manage Settings</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manage Users</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Delete Data</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">—</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="metric-card">
            <h3 className="font-semibold mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              {newPassword && newPassword.length < 8 && (
                <p className="text-sm text-destructive">Password must be at least 8 characters</p>
              )}
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
              <Button 
                variant="outline" 
                onClick={handlePasswordChange}
                disabled={changingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
              >
                {changingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Update Password
              </Button>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">Add extra security to your account (coming soon)</p>
              </div>
              <Switch disabled />
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
                <Select value={autoLogoutTime} onValueChange={handleAutoLogoutChange}>
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
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary'}`}
                onClick={() => setTheme('light')}
              >
                <div className="w-full h-16 bg-white border rounded mb-2 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-sm font-medium">Light</p>
                {theme === 'light' && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
              </div>
              <div 
                className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary'}`}
                onClick={() => setTheme('dark')}
              >
                <div className="w-full h-16 bg-gray-900 rounded mb-2 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm font-medium">Dark</p>
                {theme === 'dark' && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="font-semibold mb-4">Accent Color</h3>
            <div className="flex gap-4">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    accentColor === color.value ? 'border-foreground ring-2 ring-offset-2 ring-primary' : 'border-transparent hover:border-foreground/50'
                  }`}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  onClick={() => handleAccentColorChange(color.value)}
                  title={color.name}
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
                <Switch 
                  checked={compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sidebar Collapsed</p>
                  <p className="text-sm text-muted-foreground">Start with collapsed sidebar</p>
                </div>
                <Switch 
                  checked={sidebarCollapsed}
                  onCheckedChange={handleSidebarCollapsedChange}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* License Settings */}
        <TabsContent value="license" className="space-y-6">
          <LicenseSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
