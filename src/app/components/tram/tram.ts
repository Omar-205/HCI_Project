import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tram',
  imports: [CommonModule, RouterModule],
  templateUrl: './tram.html',
  styleUrl: './tram.css',
})
export class Tram {
  // Navigation handled via [routerLink] in template
}
