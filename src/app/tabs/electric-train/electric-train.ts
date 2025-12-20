import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTickets } from '../my-tickets/my-tickets';
import { HeroCard } from "../../components/hero-card/hero-card";
import { BookingForm } from "../../components/booking-form/booking-form";
import { ComplaintsPage } from '../complaints-page/complaints-page';
@Component({
  selector: 'app-electric-train',
  imports: [
    CommonModule,
    MyTickets,
    HeroCard,
    BookingForm,
    ComplaintsPage
  ],
  templateUrl: './electric-train.html',
  styleUrl: './electric-train.css',
  standalone: true,
})
export class ElectricTrain {
  tab = signal<string>("Book Ticket"); // the selected tab
  tabs = ["Book Ticket", "My Tickets","My Complaints"];
}
