import { Component } from '@angular/core';
import { Header } from './header/header';
import { TransportSelectorComponent } from './transport-selector/transport-selector';
import { HeroCard } from './hero-card/hero-card';
import { TicketPanel } from './ticket-panel/ticket-panel';
import { BookingForm } from './booking-form/booking-form';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    TransportSelectorComponent,
    HeroCard,
    TicketPanel,
    BookingForm
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {}
