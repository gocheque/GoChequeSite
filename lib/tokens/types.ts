export type CreditTransactionReason =
  | "purchase"
  | "consume"
  | "migration"
  | "adjustment";

export type CreditTransaction = {
  id: string;
  user_id: string;
  delta: number;
  balance_after: number;
  reason: CreditTransactionReason;
  package_id?: string | null;
  description?: string | null;
  created_at: string;
};

export type PurchaseResult = {
  balance: number;
  creditsAdded: number;
};

export type ConsumeResult = {
  balance: number;
  consumed: number;
};
