import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-electric-bus',
  templateUrl: './electric-bus.html',
  styleUrls: ['./electric-bus.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ElectricBusComponent {
  // Navigation handled via routerLink in template
}
