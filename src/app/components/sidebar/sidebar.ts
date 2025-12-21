import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Ticket, MessageSquare, Wallet, BookOpen, Plus, Settings, ChevronRight } from 'lucide-angular';
import { TicketService } from '../Service/ticket.service';
import { ComplaintService } from '../Service/complaint.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  @Output() menuItemClicked = new EventEmitter<string>();

  readonly TicketIcon = Ticket;
  readonly MessageSquareIcon = MessageSquare;
  readonly WalletIcon = Wallet;
  readonly BookOpenIcon = BookOpen;
  readonly PlusIcon = Plus;
  readonly SettingsIcon = Settings;
  readonly ChevronRightIcon = ChevronRight;

  private readonly ticketService = inject(TicketService);
  private readonly complaintService = inject(ComplaintService);

  userName: string = 'User';
  userEmail: string = '';

  // Menu items with counts
  menuItems = [
    { id: 'my-tickets', label: 'My Tickets', icon: this.TicketIcon, count: 0, active: false },
    { id: 'my-complaints', label: 'My Complaints', icon: this.MessageSquareIcon, count: 0, active: false },
    { id: 'check-balance', label: 'Check Balance', icon: this.WalletIcon, count: null, active: false },
    { id: 'book-ticket', label: 'Book Ticket', icon: this.BookOpenIcon, count: null, active: false },
    { id: 'add-complaint', label: 'Add New Complaint', icon: this.PlusIcon, count: null, active: false },
  ];

  constructor() {
    const loggedData = localStorage.getItem('Username');
    const email = localStorage.getItem('Email');
    if (loggedData) {
      this.userName = loggedData;
    }
    if (email) {
      this.userEmail = email;
    }
  }

  ngOnInit() {
    this.loadTicketCount();
    this.loadComplaintCount();
  }

  private loadTicketCount() {
    this.ticketService.getUserTickets().subscribe({
      next: (tickets) => {
        const ticketItem = this.menuItems.find(item => item.id === 'my-tickets');
        if (ticketItem) {
          ticketItem.count = tickets.length;
        }
      },
      error: (err) => {
        console.error('Error loading tickets count:', err);
      }
    });
  }

  private loadComplaintCount() {
    this.complaintService.getUserComplaints().subscribe({
      next: (complaints) => {
        const complaintItem = this.menuItems.find(item => item.id === 'my-complaints');
        if (complaintItem) {
          complaintItem.count = complaints.length;
        }
      },
      error: (err) => {
        console.error('Error loading complaints count:', err);
      }
    });
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

