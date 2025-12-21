import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Wallet, Plus, ArrowDownLeft, ArrowUpRight, History, CreditCard, RefreshCw } from 'lucide-angular';
import { WalletService } from '../../components/Service/wallet.service';
import { TransactionType } from '../../models/wallet.model';

@Component({
  selector: 'app-check-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './check-balance.html',
  styleUrls: ['./check-balance.css']
})
export class CheckBalanceComponent implements OnInit {
  walletService = inject(WalletService);

  readonly WalletIcon = Wallet;
  readonly PlusIcon = Plus;
  readonly ArrowDownIcon = ArrowDownLeft;
  readonly ArrowUpIcon = ArrowUpRight;
  readonly HistoryIcon = History;
  readonly CreditCardIcon = CreditCard;
  readonly RefreshIcon = RefreshCw;

  // For top-up form
  topUpAmount = signal<number | null>(null);
  isTopUpMode = signal<boolean>(false);
  showTransactions = signal<boolean>(false);

  // Quick top-up amounts
  quickAmounts = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadWalletData();
  }

  loadWalletData(): void {
    this.walletService.getBalance().subscribe({
      next: (balance) => {
        console.log('Balance loaded:', balance);
      },
      error: (err) => {
        console.error('Error loading balance:', err);
      }
    });

    this.walletService.getTransactions().subscribe({
      next: (transactions) => {
        console.log('Transactions loaded:', transactions);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
      }
    });
  }

  refreshBalance(): void {
    this.loadWalletData();
  }

  toggleTopUpMode(): void {
    this.isTopUpMode.update(v => !v);
    this.topUpAmount.set(null);
  }

  toggleTransactions(): void {
    this.showTransactions.update(v => !v);
  }

  selectQuickAmount(amount: number): void {
    this.topUpAmount.set(amount);
  }

  onTopUp(): void {
    const amount = this.topUpAmount();
    if (!amount || amount <= 0) {
      return;
    }

    this.walletService.topUp({ amount }).subscribe({
      next: (response) => {
        console.log('Top-up successful:', response);
        this.topUpAmount.set(null);
        this.isTopUpMode.set(false);
      },
      error: (err) => {
        console.error('Top-up failed:', err);
      }
    });
  }

  getTransactionIcon(type: TransactionType) {
    switch (type) {
      case TransactionType.TOP_UP:
        return this.ArrowDownIcon;
      case TransactionType.PAYMENT:
        return this.ArrowUpIcon;
      case TransactionType.REFUND:
        return this.ArrowDownIcon;
      default:
        return this.HistoryIcon;
    }
  }

  getTransactionClass(type: TransactionType): string {
    switch (type) {
      case TransactionType.TOP_UP:
      case TransactionType.REFUND:
        return 'text-green-500 bg-green-500/10';
      case TransactionType.PAYMENT:
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  }

  getAmountPrefix(type: TransactionType): string {
    switch (type) {
      case TransactionType.TOP_UP:
      case TransactionType.REFUND:
        return '+';
      case TransactionType.PAYMENT:
        return '-';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

