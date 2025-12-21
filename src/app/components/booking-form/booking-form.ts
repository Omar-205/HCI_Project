import { Component, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../Service/ticket.service';
import { StationService, Station } from '../Service/station.service';
import { CreateTicketRequest } from '../../models/CreateTicketRequest.model';
import { WalletService } from '../Service/wallet.service';
import { TransactionType } from '../../models/wallet.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingForm implements OnInit {
  @Input() category: 'bus' | 'tram' | 'metro' = 'metro';

  bookingForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private readonly ticketService = inject(TicketService);
  private readonly stationService = inject(StationService);
  public readonly walletService = inject(WalletService);
  private readonly router = inject(Router);

  // Dynamic station data from assets
  stations: Station[] = [];

  categories: { value: 'bus' | 'tram' | 'metro'; label: string }[] = [
    { value: 'bus', label: 'Bus' },
    { value: 'tram', label: 'Tram' },
    { value: 'metro', label: 'Metro' }
  ];

  passengers: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  baseTicketPrice: number = 1; // Base price per station
  minimumPrice: number = 10; // Minimum ticket price

  constructor(private readonly fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      category: [this.category, Validators.required],
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      passengers: [1, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Update form category when input changes
    this.bookingForm.patchValue({ category: this.category });

    // Load stations based on initial category
    this.loadStations(this.category);

    // Load wallet balance so user can see it before booking
    this.walletService.getBalance().subscribe({ next: () => {}, error: () => {} });

    // Listen for category changes to update stations
    this.bookingForm.get('category')?.valueChanges.subscribe((newCategory: 'bus' | 'tram' | 'metro') => {
      this.loadStations(newCategory);
      // Reset station selections when category changes
      this.bookingForm.patchValue({
        fromStation: '',
        toStation: ''
      });
    });
  }

  goToWallet() {
    // navigate to the wallet/check-balance page
    this.router.navigate(['/check-balance']);
  }

  refreshBalance() {
    this.walletService.getBalance().subscribe({ next: () => {}, error: () => {} });
  }

  private loadStations(category: 'bus' | 'tram' | 'metro'): void {
    this.stationService.getStationsByCategory(category).subscribe({
      next: (stations) => {
        this.stations = stations;
      },
      error: (error) => {
        console.error('Error loading stations:', error);
        this.stations = [];
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.bookingForm.value;

      const request: CreateTicketRequest = {
        category: formValue.category,
        fromPlace: formValue.fromStation,
        toPlace: formValue.toStation,
        description: formValue.description || `${formValue.category} ticket from ${formValue.fromStation} to ${formValue.toStation}`,
        price: this.getTotalPrice()
      };

      // Check wallet balance before booking
      const totalPrice = request.price;
      // Refresh balance from server then act
      this.walletService.getBalance().subscribe({
        next: (balance) => {
          if (balance < totalPrice) {
            this.isLoading = false;
            this.errorMessage = `Insufficient balance (EGP ${balance}). Please top up ${Math.ceil(totalPrice - balance)} EGP to proceed.`;
            return;
          }

          // Make payment first to deduct balance
          const paymentReq = {
            amount: totalPrice,
            type: TransactionType.PAYMENT,
            description: `Payment for ${formValue.category} ticket from ${formValue.fromStation} to ${formValue.toStation}`,
            route: `${formValue.fromStation} - ${formValue.toStation}`
          };

          this.walletService.makePayment(paymentReq).subscribe({
            next: () => {
              // Payment succeeded, create the ticket
              this.ticketService.createTicket(request).subscribe({
                next: () => {
                  this.isLoading = false;
                  this.successMessage = 'Ticket booked successfully!';
                  this.bookingForm.reset({
                    category: this.category,
                    passengers: 1
                  });
                },
                error: (error) => {
                  this.isLoading = false;
                  this.errorMessage = error.error?.message || 'Failed to book ticket. Please try again.';
                  console.error('Booking error:', error);
                }
              });
            },
            error: (err) => {
              this.isLoading = false;
              this.errorMessage = err.error?.message || 'Payment failed. Please try again or top up your wallet.';
              console.error('Payment error:', err);
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Unable to read wallet balance. Please try again later.';
          console.error('Balance fetch error:', err);
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  getTotalPrice(): number {
    const passengers = this.bookingForm.get('passengers')?.value || 1;
    const singleTicketPrice = this.calculateTicketPrice();
    return singleTicketPrice * passengers;
  }

  // Return true if wallet balance covers the current total price
  hasSufficientBalance(): boolean {
    const balance = this.walletService.balance();
    const total = this.getTotalPrice();
    return balance >= total;
  }

  // Helper to compute shortage amount (0 if sufficient)
  shortageAmount(): number {
    const balance = this.walletService.balance();
    const total = this.getTotalPrice();
    return Math.max(0, Math.ceil(total - balance));
  }

  private calculateTicketPrice(): number {
    const fromStation = this.bookingForm.get('fromStation')?.value;
    const toStation = this.bookingForm.get('toStation')?.value;

    if (!fromStation || !toStation) {
      return this.minimumPrice;
    }

    // Find the stations in the array
    const fromStationData = this.stations.find(s => s.name === fromStation);
    const toStationData = this.stations.find(s => s.name === toStation);

    if (!fromStationData || !toStationData || !fromStationData.sequence || !toStationData.sequence) {
      return this.minimumPrice;
    }

    // Calculate number of stations between (absolute difference)
    const stationCount = Math.abs(toStationData.sequence - fromStationData.sequence);

    // Calculate price: minimum price + (base price per station * number of stations)
    return this.minimumPrice + (this.baseTicketPrice * stationCount);
  }
}
