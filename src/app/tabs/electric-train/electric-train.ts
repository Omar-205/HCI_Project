import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyTickets} from '../my-tickets/my-tickets';

@Component({
  selector: 'app-electric-train',
  imports: [
    CommonModule,
    MyTickets
  ],
  templateUrl: './electric-train.html',
  styleUrl: './electric-train.css',
  standalone: true,
})
export class ElectricTrain {
  tab = signal<string>("Book Ticket"); // the selected tab
  tabs = ["Book Ticket", "My Tickets"];
}
