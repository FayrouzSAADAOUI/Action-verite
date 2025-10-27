export enum paymentStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}

export interface Payment {
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  modeUnlocked: string; // Mode ID that was unlocked
  status: paymentStatus;
}
