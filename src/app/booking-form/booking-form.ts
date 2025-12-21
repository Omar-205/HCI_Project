import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  standalone: true,  // This indicates it's a standalone component
  imports: [
    CommonModule,           // Provides *ngFor, *ngIf, etc.
    ReactiveFormsModule     // Provides formGroup, formControlName, etc.
  ],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingForm implements OnInit {
  bookingForm: FormGroup;
  
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

  passengers: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  
  ticketPrice: number = 25;

  constructor(private fb: FormBuilder) {
    // Initialize the form
    this.bookingForm = this.fb.group({
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      passengers: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log('Booking Details:', this.bookingForm.value);
      alert('Ticket booked successfully!');
    } else {
      alert('Please fill all required fields');
    }
  }

  getTotalPrice(): number {
    const passengers = this.bookingForm.get('passengers')?.value || 1;
    return this.ticketPrice * passengers;
  }
}