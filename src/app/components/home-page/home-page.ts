import { Component, signal } from '@angular/core';
import { LucideAngularModule, FileIcon, User, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-home-page',
  imports: [LucideAngularModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  standalone: true,
})
export class HomePage {
  readonly User = User;
  readonly LogOutIcon = LogOut;
  tab = signal<string>("Electric Bus"); // the selected tab
  tabs = ["Electric Bus", "Tram", "Train"];

}
