import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketResponse } from '../../models/ticketResponse.model';
import { CreateTicketRequest } from '../../models/CreateTicketRequest.model';
import { UpdateTicketModel } from '../../models/UpdateTicket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://127.0.0.1:8080/api/v1/tickets';
  private http = inject(HttpClient);

  // Create a new ticket
  createTicket(request: CreateTicketRequest): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(this.baseUrl, request);
  }

  // Get all tickets for the authenticated user
  getUserTickets(): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(this.baseUrl);
  }

  // Get a specific ticket by ID
  getTicketById(id: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.baseUrl}/${id}`);
  }

  // Update a ticket
  updateTicket(id: number, request: UpdateTicketModel): Observable<TicketResponse> {
    return this.http.put<TicketResponse>(`${this.baseUrl}/${id}`, request);
  }

  // Delete a ticket
  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Search tickets by status
  searchByStatus(status: string): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.baseUrl}/search/status`, {
      params: { status }
    });
  }

  // Search tickets by fromPlace
  searchByFromPlace(place: string): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.baseUrl}/search/from`, {
      params: { place }
    });
  }

  // Search tickets by toPlace
  searchByToPlace(place: string): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.baseUrl}/search/to`, {
      params: { place }
    });
  }
}

