// import { Component } from '@angular/core';
import { Header } from './header/header';
import { TransportSelectorComponent } from './transport-selector/transport-selector';
import { HeroCard } from './hero-card/hero-card';
import { TicketPanel } from './ticket-panel/ticket-panel';
import { BookingForm } from './booking-form/booking-form';

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePage } from "./components/home-page/home-page";
import { SignIn } from "./components/sign-in/sign-in";

@Component({
  selector: 'app-root',

  standalone: true,
  imports: [
    Header,
    TransportSelectorComponent,
    HeroCard,
    TicketPanel,
    BookingForm,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HCI_Project');
}
