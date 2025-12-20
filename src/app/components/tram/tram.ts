import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tram',
  imports: [],
  templateUrl: './tram.html',
  styleUrl: './tram.css',
})
export class Tram {
  router = inject(Router)

}
