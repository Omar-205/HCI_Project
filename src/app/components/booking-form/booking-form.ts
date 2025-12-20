import { Component, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../Service/ticket.service';
import { CreateTicketRequest } from '../../models/CreateTicketRequest.model';

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

  // Sample station data
  stations: string[] = [
    'Cairo Central',
    'Alexandria',
    'Giza',
    'Luxor',
    'Aswan',
    'Port Said',
    'Suez'
  ];

  categories: { value: 'bus' | 'tram' | 'metro'; label: string }[] = [
    { value: 'bus', label: 'Bus' },
    { value: 'tram', label: 'Tram' },
    { value: 'metro', label: 'Metro' }
  ];

  passengers: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  ticketPrice: number = 25;

  constructor(private fb: FormBuilder) {
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
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  getTotalPrice(): number {
    const passengers = this.bookingForm.get('passengers')?.value || 1;
    return this.ticketPrice * passengers;
  }
}
