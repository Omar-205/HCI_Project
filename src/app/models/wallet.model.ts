// Wallet DTOs for frontend

export enum TransactionType {
  TOP_UP = 'TOP_UP',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND'
}

export interface TopUpRequest {
  amount: number;
}

export interface PaymentRequest {
  amount: number;
  type: TransactionType;
  description: string;
  route?: string; // Optional, for transport tickets
}

export interface TransactionResponse {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string; // ISO date string from backend
  route?: string;
}

export interface WalletResponse {
  balance: number;
  message: string;
}

