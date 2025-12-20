import { Component, signal  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, LogOut , FileWarning, X } from "lucide-angular";
import { ElectricTrain } from '../../tabs/electric-train/electric-train';
import { ElectricBusComponent } from "../electric-bus/electric-bus";
import { Tram } from "../tram/tram";
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../Service/complaint.service';
import { inject } from '@angular/core';
import { ComplaintRequest, ComplaintSeverity, ComplaintType } from '../../models/ComplaintRequest';
@Component({
  selector: 'app-home-page',
  imports: [CommonModule, LucideAngularModule, ElectricTrain, ElectricBusComponent, Tram,FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage {
  UserName: string | null = "User";
  readonly User = User;
  readonly LogOutIcon = LogOut;
  tab = signal<string>("Electric Bus"); 
  tabs = ["Electric Bus", "Tram", "Train"];
  complaintService = inject(ComplaintService);

  severityOptions = Object.values(ComplaintSeverity);
  complaintTypeOptions = Object.values(ComplaintType);

  complaintData : ComplaintRequest = {
    title: '',
    description: '',
    complaintType: ComplaintType.SERVICE_QUALITY,
    ticketId: 123,
    severity: ComplaintSeverity.LOW
  };

  constructor(private router: Router, private ActiveRoute: ActivatedRoute) {
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

  readonly FileWarning = FileWarning; 
  readonly XIcon = X;

  // Add logout method
  onLogout() {
    this.router.navigate(['/sign-in']);
    localStorage.removeItem("Username")
    localStorage.removeItem("Email")
    localStorage.removeItem("TeleNumber")
  }


  onSubmitComplaint() {
    this.complaintService.createComplaint(this.complaintData).subscribe({
      next: (res) => {
        console.log('Complaint created successfully inside component', res);
      },
      error: (err) => console.error('Error in submiting the Complaint', err)
    });
    this.isModalOpen.set(false);
  }
}

