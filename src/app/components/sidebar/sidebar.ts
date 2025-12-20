import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, X, Ticket, MessageSquare, Wallet, BookOpen, Plus, Settings, ChevronRight } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Output() menuItemClicked = new EventEmitter<string>();

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly TicketIcon = Ticket;
  readonly MessageSquareIcon = MessageSquare;
  readonly WalletIcon = Wallet;
  readonly BookOpenIcon = BookOpen;
  readonly PlusIcon = Plus;
  readonly SettingsIcon = Settings;
  readonly ChevronRightIcon = ChevronRight;

  isOpen = signal<boolean>(false);
  userName: string = 'User';
  userEmail: string = 'user@email.com';

  // Menu items with counts
  menuItems = [
    { id: 'my-tickets', label: 'My Tickets', icon: this.TicketIcon, count: 3, active: false },
    { id: 'my-complaints', label: 'My Complaints', icon: this.MessageSquareIcon, count: 2, active: false },
    { id: 'check-balance', label: 'Check Balance', icon: this.WalletIcon, count: null, active: false },
    { id: 'book-ticket', label: 'Book Ticket', icon: this.BookOpenIcon, count: null, active: false },
    { id: 'add-complaint', label: 'Add New Complaint', icon: this.PlusIcon, count: null, active: false },
  ];

  constructor(private router: Router) {
    const loggedData = localStorage.getItem('Username');
    const email = localStorage.getItem('Email');
    if (loggedData) {
      this.userName = loggedData;
    }
    if (email) {
      this.userEmail = email;
    }
  }

  toggleSidebar() {
    this.isOpen.update(v => !v);
  }

  closeSidebar() {
    this.isOpen.set(false);
  }

  onMenuItemClick(itemId: string) {
    // Reset all active states
    this.menuItems.forEach(item => item.active = false);

    // Set the clicked item as active
    const clickedItem = this.menuItems.find(item => item.id === itemId);
    if (clickedItem) {
      clickedItem.active = true;
    }

    // Emit the event for parent component to handle
    this.menuItemClicked.emit(itemId);
  }

  onSettingsClick() {
    this.menuItemClicked.emit('settings');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}

