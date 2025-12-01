import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, LogOut } from "lucide-angular";
import { ElectricTrain } from '../../tabs/electric-train/electric-train';
import { ElectricBusComponent } from "../electric-bus/electric-bus";
import { Tram } from "../tram/tram";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, LucideAngularModule, ElectricTrain, ElectricBusComponent, Tram],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage {
  readonly User = User;
  readonly LogOutIcon = LogOut;
  tab = signal<string>("Electric Bus"); // the selected tab
  tabs = ["Electric Bus", "Tram", "Train"];

  constructor(private router: Router) {}

  // Add logout method
  onLogout() {
    this.router.navigate(['/sign-in']);
  }
}
