import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-electric-train',
  imports: [CommonModule, RouterModule],
  templateUrl: './electric-train.html',
  styleUrl: './electric-train.css',
  standalone: true,
})
export class ElectricTrain {
  // Navigation via routerLink in template
}
