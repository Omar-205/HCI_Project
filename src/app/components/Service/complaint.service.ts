import { computed, Injectable, signal } from '@angular/core';
import { ComplaintRequest } from '../../models/ComplaintRequest';
import { ComplaintResponse, ComplaintStatus } from '../../models/ComplaintResponse';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  private HoldingComplaintData : ComplaintRequest | null = null;


  complaintsList   = signal<ComplaintResponse[]>([
    {
      id: 1,
      title: 'Bus #102 Delayed',
      description: 'The bus was 25 minutes late at the station.',
      complaintType: 'DELAY',
      severity: 'Medium',
      status: ComplaintStatus.IN_PROGRESS,
      ticketId: 'TCK-8821',
      ticketTitle: 'Main Station Route',
      userId: 'USR-01',
      userEmail: 'user@greenlink.com',
      userName: 'Ahmed Ali',
      response: 'We are checking with the driver.',
      respondedById: 'STAFF-05',
      respondedByName: 'Sara Admin',
      createdAt: '2025-11-10',
      resolvedAt: ''
    },
    {
      id: 2,
      title: 'Broken Seat in Tram',
      description: 'Seat number 12 in the second car is broken.',
      complaintType: 'VEHICLE_CONDITION',
      severity: 'Low',
      status: ComplaintStatus.RESOLVED,
      ticketId: 'TCK-4432',
      ticketTitle: 'Blue Line Tram',
      userId: 'USR-01',
      userEmail: 'user@greenlink.com',
      userName: 'Ahmed Ali',
      response: 'The seat has been fixed by the maintenance team.',
      respondedById: 'STAFF-09',
      respondedByName: 'Hany Tech',
      createdAt: '2025-11-05',
      resolvedAt: '2025-11-07'
    },
    {
      id: 3,
      title: 'Overcharged for Ticket',
      description: 'The app charged me twice for the same trip.',
      complaintType: 'PRICING_ISSUE',
      severity: 'High',
      status: ComplaintStatus.SUBMITTED,
      ticketId: 'TCK-9901',
      ticketTitle: 'Electric Bus Ticket',
      userId: 'USR-01',
      userEmail: 'user@greenlink.com',
      userName: 'Ahmed Ali',
      response: '',
      respondedById: '',
      respondedByName: '',
      createdAt: '2025-11-12',
      resolvedAt: ''
    }
  ]);

  activeListComplaint = computed(() => {
    return this.complaintsList().filter(complaint => complaint.status !== ComplaintStatus.RESOLVED);
  });

  resolvedListComplaint = computed(() => {
    return this.complaintsList().filter(complaint => complaint.status === ComplaintStatus.RESOLVED);
  });

  setComplaintData(data: ComplaintRequest) {
    this.HoldingComplaintData = data;
  }

  getComplaintData(): ComplaintRequest | null {
    return this.HoldingComplaintData;
  }

  clearComplaintData() {
    this.HoldingComplaintData = null;
  }


  submitComplaint(complaint: ComplaintRequest) {
    console.log('Complaint submitted:', complaint);
  }


}
