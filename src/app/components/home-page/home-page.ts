import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, LogOut } from "lucide-angular";
import { ElectricTrain } from '../../tabs/electric-train/electric-train';
import { ElectricBusComponent } from "../electric-bus/electric-bus";
import { Tram } from "../tram/tram";
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../Service/ClientIF';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, LucideAngularModule, ElectricTrain, ElectricBusComponent, Tram],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage {
  UserName: string | null = "User";
  readonly User = User;
  readonly LogOutIcon = LogOut;
  tab = signal<string>("Electric Bus"); // the selected tab
  tabs = ["Electric Bus", "Tram", "Train"];

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

  // Add logout method
  onLogout() {
    this.router.navigate(['/sign-in']);
    localStorage.removeItem("Username")
    localStorage.removeItem("Email")
    localStorage.removeItem("TeleNumber")
  }
}

