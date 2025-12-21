import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, LogOut, TriangleAlert, X } from "lucide-angular";
import { ElectricTrain } from '../../tabs/electric-train/electric-train';
import { ElectricBusComponent } from "../electric-bus/electric-bus";
import { Tram } from "../tram/tram";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../Service/complaint.service';
import { ComplaintRequest, ComplaintSeverity, ComplaintType } from '../../models/ComplaintRequest';
import { SidebarComponent } from '../sidebar/sidebar';
import { BookingForm } from '../booking-form/booking-form';
import { MyTickets } from '../../tabs/my-tickets/my-tickets';
import { ComplaintsPage } from '../../tabs/complaints-page/complaints-page';
import { CheckBalanceComponent } from '../../tabs/check-balance/check-balance';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, LucideAngularModule, ElectricTrain, ElectricBusComponent, Tram, FormsModule, SidebarComponent, BookingForm, MyTickets, ComplaintsPage, CheckBalanceComponent],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage {
  UserName: string | null = "User";
  readonly User = User;
  readonly LogOutIcon = LogOut;
  tab = signal<string>("Electric Bus");
  tabs = ["Electric Bus", "Tram", "Metro"];
  complaintService = inject(ComplaintService);

  // Track which sidebar content to show
  sidebarContent = signal<string | null>(null);

  severityOptions = Object.values(ComplaintSeverity);
  complaintTypeOptions = Object.values(ComplaintType);

  complaintData: ComplaintRequest = {
    title: '',
    description: '',
    complaintType: ComplaintType.SERVICE_QUALITY,
    ticketId: 123,
    severity: ComplaintSeverity.LOW
  };

  constructor(private readonly router: Router) {
    const loggeddata = localStorage.getItem("Username")
    if (loggeddata != null) {
      this.UserName = loggeddata;
    }
  }
  // ngOnInit(): void {
  //   this.ActiveRoute.queryParams.subscribe(
  //     params => {
  //       this.UserName = params['username'];
  //     }
  //   )
  // }

  isModalOpen = signal<boolean>(false);

  readonly FileWarning = TriangleAlert;
  readonly XIcon = X;

  // Add logout method
  onLogout() {
    this.router.navigate(['/sign-in']);
    localStorage.removeItem("Username")
    localStorage.removeItem("Email")
    localStorage.removeItem("TeleNumber")
  }


  onSubmitComplaint() {
    // 2l mafrod hena 2ana h3mel call ba2a lel service w 2deha 2l complaintData 3shan ttsagel fe 2l backend
    this.complaintService.createComplaint(this.complaintData).subscribe({
      next: (res) => {
        console.log('Complaint created successfully', res);
        this.isModalOpen.set(false);
        // Reset complaint data
        this.complaintData = {
          title: '',
          description: '',
          complaintType: ComplaintType.SERVICE_QUALITY,
          ticketId: 123,
          severity: ComplaintSeverity.LOW
        };
      },
      error: (err) => {
        console.error('Error creating complaint:', err);
      }
    });
  }

  closeSidebarContent() {
    this.sidebarContent.set(null);
  }

  getBookingCategory(): 'bus' | 'tram' | 'metro' {
    const currentTab = this.tab();
    if (currentTab === 'Electric Bus') return 'bus';
    if (currentTab === 'Tram') return 'tram';
    if (currentTab === 'Metro') return 'metro';
    return 'metro'; // default
  }

  onSidebarMenuClick(itemId: string) {
    switch (itemId) {
      case 'my-tickets':
        this.sidebarContent.set('my-tickets');
        break;
      case 'my-complaints':
        this.sidebarContent.set('my-complaints');
        break;
      case 'check-balance':
        this.sidebarContent.set('check-balance');
        break;
      case 'book-ticket':
        this.sidebarContent.set('book-ticket');
        break;
      case 'add-complaint':
        this.isModalOpen.set(true);
        break;
      case 'settings':
        // Handle settings
        break;
    }
  }
}

