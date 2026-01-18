export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      active_sessions: {
        Row: {
          created_at: string
          device_info: string | null
          id: string
          ip_address: string | null
          last_activity: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      backup_settings: {
        Row: {
          auto_backup_enabled: boolean | null
          backup_time: string | null
          created_at: string
          frequency: string | null
          id: string
          retention_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_backup_enabled?: boolean | null
          backup_time?: string | null
          created_at?: string
          frequency?: string | null
          id?: string
          retention_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_backup_enabled?: boolean | null
          backup_time?: string | null
          created_at?: string
          frequency?: string | null
          id?: string
          retention_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      backups: {
        Row: {
          backup_date: string
          backup_name: string
          backup_type: string
          created_at: string
          file_size: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          backup_date?: string
          backup_name: string
          backup_type?: string
          created_at?: string
          file_size?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          backup_date?: string
          backup_name?: string
          backup_type?: string
          created_at?: string
          file_size?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string | null
          bank_name: string | null
          created_at: string
          current_balance: number | null
          id: string
          ifsc_code: string | null
          is_primary: boolean | null
          opening_balance: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          current_balance?: number | null
          id?: string
          ifsc_code?: string | null
          is_primary?: boolean | null
          opening_balance?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          current_balance?: number | null
          id?: string
          ifsc_code?: string | null
          is_primary?: boolean | null
          opening_balance?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_account_id: string
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount?: number
          bank_account_id: string
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          auto_print_on_save: boolean | null
          business_address: string | null
          business_name: string | null
          created_at: string
          default_payment_terms: number | null
          email: string | null
          estimation_prefix: string | null
          financial_year_start: string | null
          gst_payable: number | null
          gst_receivable: number | null
          gst_registration_type: string | null
          gstin: string | null
          id: string
          invoice_prefix: string | null
          invoice_template: string | null
          invoice_terms: string | null
          logo_url: string | null
          next_invoice_number: number | null
          pan: string | null
          paper_size: string | null
          phone: string | null
          purchase_prefix: string | null
          show_bank_details: boolean | null
          show_logo_on_invoice: boolean | null
          show_qr_code: boolean | null
          state_code: string | null
          tcs_payable: number | null
          tcs_receivable: number | null
          tds_payable: number | null
          tds_receivable: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_print_on_save?: boolean | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string
          default_payment_terms?: number | null
          email?: string | null
          estimation_prefix?: string | null
          financial_year_start?: string | null
          gst_payable?: number | null
          gst_receivable?: number | null
          gst_registration_type?: string | null
          gstin?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_template?: string | null
          invoice_terms?: string | null
          logo_url?: string | null
          next_invoice_number?: number | null
          pan?: string | null
          paper_size?: string | null
          phone?: string | null
          purchase_prefix?: string | null
          show_bank_details?: boolean | null
          show_logo_on_invoice?: boolean | null
          show_qr_code?: boolean | null
          state_code?: string | null
          tcs_payable?: number | null
          tcs_receivable?: number | null
          tds_payable?: number | null
          tds_receivable?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_print_on_save?: boolean | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string
          default_payment_terms?: number | null
          email?: string | null
          estimation_prefix?: string | null
          financial_year_start?: string | null
          gst_payable?: number | null
          gst_receivable?: number | null
          gst_registration_type?: string | null
          gstin?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_template?: string | null
          invoice_terms?: string | null
          logo_url?: string | null
          next_invoice_number?: number | null
          pan?: string | null
          paper_size?: string | null
          phone?: string | null
          purchase_prefix?: string | null
          show_bank_details?: boolean | null
          show_logo_on_invoice?: boolean | null
          show_qr_code?: boolean | null
          state_code?: string | null
          tcs_payable?: number | null
          tcs_receivable?: number | null
          tds_payable?: number | null
          tds_receivable?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cash_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          expense_date: string
          expense_number: string
          id: string
          notes: string | null
          payment_mode: string | null
          reference_number: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          expense_date?: string
          expense_number: string
          id?: string
          notes?: string | null
          payment_mode?: string | null
          reference_number?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          expense_date?: string
          expense_number?: string
          id?: string
          notes?: string | null
          payment_mode?: string | null
          reference_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          category_id: string | null
          created_at: string
          current_stock: number | null
          deleted_at: string | null
          hsn_code: string | null
          id: string
          is_deleted: boolean | null
          low_stock_alert: number | null
          name: string
          opening_stock: number | null
          purchase_price: number | null
          sale_price: number | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          current_stock?: number | null
          deleted_at?: string | null
          hsn_code?: string | null
          id?: string
          is_deleted?: boolean | null
          low_stock_alert?: number | null
          name: string
          opening_stock?: number | null
          purchase_price?: number | null
          sale_price?: number | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          current_stock?: number | null
          deleted_at?: string | null
          hsn_code?: string | null
          id?: string
          is_deleted?: boolean | null
          low_stock_alert?: number | null
          name?: string
          opening_stock?: number | null
          purchase_price?: number | null
          sale_price?: number | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      license_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          plan_name: string
          price: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean | null
          plan_name: string
          price?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          plan_name?: string
          price?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      license_settings: {
        Row: {
          created_at: string
          expiry_date: string
          id: string
          license_type: string
          licensed_to: string | null
          max_simultaneous_logins: number | null
          max_users: number | null
          support_email: string | null
          support_phone: string | null
          support_whatsapp: string | null
          updated_at: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expiry_date?: string
          id?: string
          license_type?: string
          licensed_to?: string | null
          max_simultaneous_logins?: number | null
          max_users?: number | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expiry_date?: string
          id?: string
          license_type?: string
          licensed_to?: string | null
          max_simultaneous_logins?: number | null
          max_users?: number | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      parties: {
        Row: {
          billing_address: string | null
          created_at: string
          credit_limit: number | null
          email: string | null
          gstin: string | null
          id: string
          name: string
          opening_balance: number | null
          party_type: string | null
          phone: string | null
          shipping_address: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          opening_balance?: number | null
          party_type?: string | null
          phone?: string | null
          shipping_address?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: string | null
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          opening_balance?: number | null
          party_type?: string | null
          phone?: string | null
          shipping_address?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          party_id: string | null
          payment_date: string
          payment_mode: string | null
          payment_number: string
          payment_type: string
          purchase_invoice_id: string | null
          reference_number: string | null
          sale_invoice_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          party_id?: string | null
          payment_date?: string
          payment_mode?: string | null
          payment_number: string
          payment_type: string
          purchase_invoice_id?: string | null
          reference_number?: string | null
          sale_invoice_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          party_id?: string | null
          payment_date?: string
          payment_mode?: string | null
          payment_number?: string
          payment_type?: string
          purchase_invoice_id?: string | null
          reference_number?: string | null
          sale_invoice_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_purchase_invoice_id_fkey"
            columns: ["purchase_invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sale_invoice_id_fkey"
            columns: ["sale_invoice_id"]
            isOneToOne: false
            referencedRelation: "sale_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          parent_user_id: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          parent_user_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          parent_user_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_invoice_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          discount_percent: number | null
          hsn_code: string | null
          id: string
          item_id: string | null
          item_name: string
          purchase_invoice_id: string
          quantity: number
          rate: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          unit: string | null
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          hsn_code?: string | null
          id?: string
          item_id?: string | null
          item_name: string
          purchase_invoice_id: string
          quantity?: number
          rate?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          unit?: string | null
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          hsn_code?: string | null
          id?: string
          item_id?: string | null
          item_name?: string
          purchase_invoice_id?: string
          quantity?: number
          rate?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_invoice_items_purchase_invoice_id_fkey"
            columns: ["purchase_invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_invoices: {
        Row: {
          balance_due: number | null
          created_at: string
          deleted_at: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          invoice_type: string
          is_deleted: boolean | null
          notes: string | null
          paid_amount: number | null
          party_id: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tcs_amount: number | null
          terms: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_due?: number | null
          created_at?: string
          deleted_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          invoice_type?: string
          is_deleted?: boolean | null
          notes?: string | null
          paid_amount?: number | null
          party_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tcs_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_due?: number | null
          created_at?: string
          deleted_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          invoice_type?: string
          is_deleted?: boolean | null
          notes?: string | null
          paid_amount?: number | null
          party_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tcs_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoices_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_invoice_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          discount_percent: number | null
          hsn_code: string | null
          id: string
          item_id: string | null
          item_name: string
          quantity: number
          rate: number
          sale_invoice_id: string
          tax_amount: number | null
          tax_rate: number | null
          total: number
          unit: string | null
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          hsn_code?: string | null
          id?: string
          item_id?: string | null
          item_name: string
          quantity?: number
          rate?: number
          sale_invoice_id: string
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          unit?: string | null
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          discount_percent?: number | null
          hsn_code?: string | null
          id?: string
          item_id?: string | null
          item_name?: string
          quantity?: number
          rate?: number
          sale_invoice_id?: string
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_invoice_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_invoice_items_sale_invoice_id_fkey"
            columns: ["sale_invoice_id"]
            isOneToOne: false
            referencedRelation: "sale_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_invoices: {
        Row: {
          balance_due: number | null
          created_at: string
          deleted_at: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          invoice_type: string
          is_deleted: boolean | null
          notes: string | null
          paid_amount: number | null
          party_id: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tcs_amount: number | null
          terms: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_due?: number | null
          created_at?: string
          deleted_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          invoice_type?: string
          is_deleted?: boolean | null
          notes?: string | null
          paid_amount?: number | null
          party_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tcs_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_due?: number | null
          created_at?: string
          deleted_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          invoice_type?: string
          is_deleted?: boolean | null
          notes?: string | null
          paid_amount?: number | null
          party_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tcs_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_invoices_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          business_name: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          status: string | null
          trial_end_date: string | null
          trial_start_date: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          business_name?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          status?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          business_name?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          status?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
        }
        Relationships: []
      }
      units: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          symbol: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          symbol?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          symbol?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          parent_user_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_user_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_user_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_write: { Args: { _user_id: string }; Returns: boolean }
      get_admin_user_id: { Args: { _user_id: string }; Returns: string }
      get_family_user_ids: {
        Args: { _user_id: string }
        Returns: {
          family_user_id: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "supervisor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "supervisor", "viewer"],
    },
  },
} as const
