export type UserCredits = {
  user_id: string;
  balance: number;
  updated_at: string;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  delta: number;
  balance_after: number;
  reason: "purchase" | "consume" | "migration" | "adjustment";
  package_id: string | null;
  description: string | null;
  created_at: string;
};

export type StripeCheckoutOrder = {
  id: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  user_id: string;
  package_id: string;
  amount_cents: number;
  tokens_count: number;
  status: "pending" | "processing" | "completed" | "failed";
  granted_keys: unknown | null;
  balance_after: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      user_credits: {
        Row: UserCredits;
        Insert: {
          user_id: string;
          balance?: number;
          updated_at?: string;
        };
        Update: Partial<UserCredits>;
        Relationships: [];
      };
      credit_transactions: {
        Row: CreditTransaction;
        Insert: {
          user_id: string;
          delta: number;
          balance_after: number;
          reason: CreditTransaction["reason"];
          package_id?: string | null;
          description?: string | null;
        };
        Update: Partial<CreditTransaction>;
        Relationships: [];
      };
      stripe_checkout_orders: {
        Row: StripeCheckoutOrder;
        Insert: {
          stripe_checkout_session_id: string;
          stripe_payment_intent_id?: string | null;
          user_id: string;
          package_id: string;
          amount_cents: number;
          tokens_count: number;
          status?: StripeCheckoutOrder["status"];
          granted_keys?: unknown | null;
          balance_after?: number | null;
          error_message?: string | null;
          completed_at?: string | null;
        };
        Update: Partial<StripeCheckoutOrder>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      purchase_credits: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_package_id: string;
          p_description?: string | null;
        };
        Returns: { balance: number; credits_added: number };
      };
      consume_credit: {
        Args: {
          p_user_id: string;
          p_amount?: number;
          p_description?: string | null;
        };
        Returns: { balance: number; consumed: number };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
