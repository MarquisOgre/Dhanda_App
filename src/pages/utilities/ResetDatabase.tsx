import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetDatabase() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  const CONFIRM_PHRASE = "DELETE ALL DATA";

  const addProgress = (message: string) => {
    setProgress(prev => [...prev, message]);
  };

  const handleReset = async () => {
    if (!user || !isAdmin) {
      toast.error("Only admins can reset the database");
      return;
    }

    if (confirmText !== CONFIRM_PHRASE) {
      toast.error("Please type the confirmation phrase exactly");
      return;
    }

    setIsResetting(true);
    setProgress([]);

    try {
      // Delete in proper order respecting foreign keys
      
      // 1. Delete sale invoice items first
      addProgress("Deleting sale invoice items...");
      await supabase
        .from('sale_invoice_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      addProgress("✓ Sale invoice items deleted");

      // 2. Delete purchase invoice items
      addProgress("Deleting purchase invoice items...");
      await supabase
        .from('purchase_invoice_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      addProgress("✓ Purchase invoice items deleted");

      // 2. Delete payments (may reference invoices)
      addProgress("Deleting payments...");
      const { error: paymentsError } = await supabase
        .from('payments')
        .delete()
        .eq('user_id', user.id);
      
      if (paymentsError) console.error('Payments deletion error:', paymentsError);
      addProgress("✓ Payments deleted");

      // 3. Delete sale invoices
      addProgress("Deleting sale invoices...");
      const { error: saleInvoicesError } = await supabase
        .from('sale_invoices')
        .delete()
        .eq('user_id', user.id);
      
      if (saleInvoicesError) console.error('Sale invoices deletion error:', saleInvoicesError);
      addProgress("✓ Sale invoices deleted");

      // 4. Delete purchase invoices
      addProgress("Deleting purchase invoices...");
      const { error: purchaseInvoicesError } = await supabase
        .from('purchase_invoices')
        .delete()
        .eq('user_id', user.id);
      
      if (purchaseInvoicesError) console.error('Purchase invoices deletion error:', purchaseInvoicesError);
      addProgress("✓ Purchase invoices deleted");

      // 5. Delete expenses
      addProgress("Deleting expenses...");
      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', user.id);
      
      if (expensesError) console.error('Expenses deletion error:', expensesError);
      addProgress("✓ Expenses deleted");

      // 6. Delete cash transactions
      addProgress("Deleting cash transactions...");
      const { error: cashError } = await supabase
        .from('cash_transactions')
        .delete()
        .eq('user_id', user.id);
      
      if (cashError) console.error('Cash transactions deletion error:', cashError);
      addProgress("✓ Cash transactions deleted");

      // 7. Delete items
      addProgress("Deleting items...");
      const { error: itemsError } = await supabase
        .from('items')
        .delete()
        .eq('user_id', user.id);
      
      if (itemsError) console.error('Items deletion error:', itemsError);
      addProgress("✓ Items deleted");

      // 8. Delete categories
      addProgress("Deleting categories...");
      const { error: categoriesError } = await supabase
        .from('categories')
        .delete()
        .eq('user_id', user.id);
      
      if (categoriesError) console.error('Categories deletion error:', categoriesError);
      addProgress("✓ Categories deleted");

      // 9. Delete parties
      addProgress("Deleting parties...");
      const { error: partiesError } = await supabase
        .from('parties')
        .delete()
        .eq('user_id', user.id);
      
      if (partiesError) console.error('Parties deletion error:', partiesError);
      addProgress("✓ Parties deleted");

      // 10. Delete bank accounts
      addProgress("Deleting bank accounts...");
      const { error: bankError } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('user_id', user.id);
      
      if (bankError) console.error('Bank accounts deletion error:', bankError);
      addProgress("✓ Bank accounts deleted");

      // 11. Delete units
      addProgress("Deleting units...");
      const { error: unitsError } = await supabase
        .from('units')
        .delete()
        .eq('user_id', user.id);
      
      if (unitsError) console.error('Units deletion error:', unitsError);
      addProgress("✓ Units deleted");

      // 12. Delete notifications
      addProgress("Deleting notifications...");
      const { error: notificationsError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      if (notificationsError) console.error('Notifications deletion error:', notificationsError);
      addProgress("✓ Notifications deleted");

      // 13. Delete backups
      addProgress("Deleting backups...");
      const { error: backupsError } = await supabase
        .from('backups')
        .delete()
        .eq('user_id', user.id);
      
      if (backupsError) console.error('Backups deletion error:', backupsError);
      addProgress("✓ Backups deleted");

      addProgress("Database reset complete!");
      setResetComplete(true);
      toast.success("Database has been reset successfully");
    } catch (error: any) {
      console.error("Error resetting database:", error);
      addProgress("❌ Error: " + error.message);
      toast.error("Failed to reset database. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reset Database</h1>
          <p className="text-muted-foreground">Clear all business data</p>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <XCircle className="w-12 h-12 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Access Denied</h3>
                <p className="text-muted-foreground">
                  Only administrators can reset the database. Please contact your admin if you need this action performed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reset Database</h1>
          <p className="text-muted-foreground">Clear all business data</p>
        </div>

        <Card className="border-success/50 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="w-16 h-16 text-success" />
              <div className="text-center">
                <h3 className="font-semibold text-xl">Database Reset Complete</h3>
                <p className="text-muted-foreground mt-2">
                  All your business data has been permanently deleted. You can now start fresh.
                </p>
              </div>
              <Button onClick={() => navigate("/")} className="mt-4">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {progress.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reset Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono bg-muted p-4 rounded-lg max-h-48 overflow-y-auto">
                {progress.map((msg, i) => (
                  <div key={i} className="py-0.5">{msg}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reset Database</h1>
        <p className="text-muted-foreground">Clear all business data</p>
      </div>

      {/* Warning Card */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-background rounded-lg border border-destructive/30">
            <h4 className="font-semibold mb-2">The following data will be permanently deleted:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>All parties (customers & suppliers)</li>
              <li>All items, categories & units</li>
              <li>All invoices (sales & purchases)</li>
              <li>All payments (in & out)</li>
              <li>All expenses</li>
              <li>All cash transactions</li>
              <li>All bank account records</li>
              <li>All notifications & backups</li>
            </ul>
          </div>

          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <p className="text-sm font-medium">
              ⚠️ Your user account and settings will NOT be deleted. Only business transaction data will be removed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Required</CardTitle>
          <CardDescription>Please complete the following steps to reset the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className={`p-4 rounded-lg border ${step >= 1 ? 'border-primary bg-primary/5' : 'border-muted'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <h4 className="font-semibold">Understand the consequences</h4>
            </div>
            <p className="text-sm text-muted-foreground ml-11">
              I understand that all my business data will be permanently deleted and cannot be recovered.
            </p>
            {step === 1 && (
              <Button className="ml-11 mt-3" onClick={() => setStep(2)}>
                I Understand, Continue
              </Button>
            )}
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-lg border ${step >= 2 ? 'border-primary bg-primary/5' : 'border-muted'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <h4 className="font-semibold">Backup recommendation</h4>
            </div>
            <p className="text-sm text-muted-foreground ml-11">
              We strongly recommend creating a backup before proceeding. Have you backed up your data?
            </p>
            {step === 2 && (
              <div className="ml-11 mt-3 flex gap-2">
                <Button variant="outline" onClick={() => navigate("/backup/download")}>
                  Create Backup First
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue Without Backup
                </Button>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-lg border ${step >= 3 ? 'border-destructive bg-destructive/5' : 'border-muted'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <h4 className="font-semibold">Final confirmation</h4>
            </div>
            {step === 3 && (
              <div className="ml-11 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm">
                    Type <span className="font-mono font-bold text-destructive">{CONFIRM_PHRASE}</span> to confirm
                  </Label>
                  <Input
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type the phrase above"
                    className="max-w-sm"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  disabled={confirmText !== CONFIRM_PHRASE || isResetting}
                  className="gap-2"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting Database...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Reset Database Permanently
                    </>
                  )}
                </Button>

                {isResetting && progress.length > 0 && (
                  <div className="text-sm font-mono bg-muted p-4 rounded-lg max-h-32 overflow-y-auto">
                    {progress.map((msg, i) => (
                      <div key={i} className="py-0.5">{msg}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}