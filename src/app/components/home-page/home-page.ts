import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, LogOut } from "lucide-angular";
import {ElectricTrain} from '../../tabs/electric-train/electric-train';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, LucideAngularModule, ElectricTrain],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  standalone: true,
})
export class HomePage {
  readonly User = User;
  readonly LogOutIcon = LogOut;
  tab = signal<string>("Electric Bus"); // the selected tab
  tabs = ["Electric Bus", "Tram", "Train"];

}
