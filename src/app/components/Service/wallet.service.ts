import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  TopUpRequest,
  PaymentRequest,
  TransactionResponse,
  WalletResponse
} from '../../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private baseUrl = 'http://127.0.0.1:8080/api/v1/wallet';
  private http = inject(HttpClient);

  // Signals for reactive state management
  balance = signal<number>(0);
  transactions = signal<TransactionResponse[]>([]);
  isLoading = signal<boolean>(false);

  // Get current balance
  getBalance(): Observable<number> {
    this.isLoading.set(true);
    return this.http.get<number>(`${this.baseUrl}/balance`).pipe(
      tap({
        next: (balance) => {
          this.balance.set(balance);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  // Top up wallet
  topUp(request: TopUpRequest): Observable<WalletResponse> {
    this.isLoading.set(true);
    return this.http.post<WalletResponse>(`${this.baseUrl}/top-up`, request).pipe(
      tap({
        next: (response) => {
          this.balance.set(response.balance);
          this.isLoading.set(false);
          // Refresh transactions after top-up
          this.getTransactions().subscribe();
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  // Make a payment
  makePayment(request: PaymentRequest): Observable<WalletResponse> {
    this.isLoading.set(true);
    return this.http.post<WalletResponse>(`${this.baseUrl}/payment`, request).pipe(
      tap({
        next: (response) => {
          this.balance.set(response.balance);
          this.isLoading.set(false);
          // Refresh transactions after payment
          this.getTransactions().subscribe();
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  // Get transaction history
  getTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/transactions`).pipe(
      tap({
        next: (transactions) => {
          this.transactions.set(transactions);
        }
      })
    );
  }
}

