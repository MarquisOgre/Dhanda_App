import { supabase } from "@/integrations/supabase/client";

// Payment modes that should be treated as bank transactions
const BANK_MODES = ["bank", "upi", "card", "cheque"];

export async function recordCashBankTransaction({
  userId,
  paymentMode,
  amount,
  transactionType,
  description,
  referenceType,
  referenceId,
  transactionDate,
}: {
  userId: string;
  paymentMode: string;
  amount: number;
  transactionType: "in" | "out";
  description: string;
  referenceType?: string;
  referenceId?: string;
  transactionDate: string;
}) {
  const isBankTransaction = BANK_MODES.includes(paymentMode.toLowerCase());

  if (isBankTransaction) {
    // Get the primary bank account or first available
    const { data: bankAccounts } = await supabase
      .from("bank_accounts")
      .select("id, current_balance, is_primary")
      .order("is_primary", { ascending: false })
      .limit(1);

    if (bankAccounts && bankAccounts.length > 0) {
      const account = bankAccounts[0];
      const newBalance = transactionType === "in"
        ? (account.current_balance || 0) + amount
        : (account.current_balance || 0) - amount;

      // Insert bank transaction
      await supabase.from("bank_transactions").insert({
        user_id: userId,
        bank_account_id: account.id,
        transaction_type: transactionType,
        amount: amount,
        description: description,
        reference_type: referenceType || null,
        reference_id: referenceId || null,
        transaction_date: transactionDate,
      });

      // Update bank account balance
      await supabase
        .from("bank_accounts")
        .update({ current_balance: newBalance })
        .eq("id", account.id);
    }
  } else {
    // Cash transaction
    await supabase.from("cash_transactions").insert({
      user_id: userId,
      transaction_type: transactionType,
      amount: amount,
      description: description,
      reference_type: referenceType || null,
      reference_id: referenceId || null,
      transaction_date: transactionDate,
    });
  }
}
