import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, LogOut , FileWarning, X } from "lucide-angular";
import { ElectricTrain } from '../../tabs/electric-train/electric-train';
import { ElectricBusComponent } from "../electric-bus/electric-bus";
import { Tram } from "../tram/tram";
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


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

  complaintData = {
    title: '',
    description: '',
    type: 'Service Issue',
    ticketId: 'TCK-UTW4G0OMU',
    severity: 'Medium'
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
    console.log("Sending Data to Backend:", this.complaintData);
    // 2l mafrod hena 2ana h3mel call ba2a lel service w 2deha 2l complaintData 3shan ttsagel fe 2l backend
    this.isModalOpen.set(false);
  }
}

