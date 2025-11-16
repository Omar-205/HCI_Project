import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ticket} from '../../models/ticket.model';

@Component({
  selector: 'app-my-tickets',
  imports: [CommonModule],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css',
  standalone: true,
})
export class MyTickets {
  tickets: Ticket[] = [
    {
      id: "T001",
      userId: "U100",
      type: "bus",
      from: "Alexandria",
      to: "Stanley Bridge",
      date: "2025-11-20",
      time: "09:30",
      price: 25,
      seatNumber: "12A",
      status: "active",
      qrCode: {
        data: "data:image/png;base64,QR_SAMPLE_1",
        createdAt: "2025-11-16T10:00:00Z"
      }
    },

    {
      id: "TKT-2024-001",
      userId: "U100",
      type: "train",
      from: "Alexandria Main Station",
      to: "Sidi Gaber Station",
      date: "2024-11-15",
      time: "09:30",
      price: 25,
      seatNumber: "A-12",
      status: "active",
      qrCode: {
        data: "data:image/png;base64,QR_SAMPLE_2",
        createdAt: "2025-11-16T10:05:00Z"
      }
    },

    {
      id: "T003",
      userId: "U100",
      type: "metro",
      from: "Alexandria",
      to: "El Raml Station",
      date: "2025-11-22",
      time: "14:45",
      price: 15,
      status: "used",
      qrCode: {
        data: "data:image/png;base64,QR_SAMPLE_3",
        createdAt: "2025-11-16T10:10:00Z"
      }
    }
  ];



}
