import { computed, Injectable, signal,inject } from '@angular/core';
import { ComplaintRequest } from '../../models/ComplaintRequest';
import { ComplaintResponse, ComplaintStatus } from '../../models/ComplaintResponse';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ComplaintService {

  private apiUrl = 'http://localhost:8080/api/v1/complaints';
  private http = inject(HttpClient);

  complaintsList   = signal<ComplaintResponse[]>([]);

  editedComplaint = signal<ComplaintRequest | null>(null);

  activeListComplaint = computed(() => {
    return this.complaintsList().filter(complaint => complaint.status !== ComplaintStatus.RESOLVED);
  });

  resolvedListComplaint = computed(() => {
    return this.complaintsList().filter(complaint => complaint.status === ComplaintStatus.RESOLVED);
  });


  // submitComplaint(complaint: ComplaintRequest) {
  //   this.createComplaint(complaint).subscribe({
  //     next: (res) => {
  //       console.log('Complaint created successfully inside service', res);
  //     },
  //     error: (err) => console.error('Error in submitComplaint', err)
  //   });
  // }

  // getAllComplaints() {
  //   return this.getUserComplaints().subscribe({
  //     next: () => console.log('Fetched complaints successfully'),
  //     error: (err) => console.error('Fetch failed', err)
  //   });
  // }


  // DeleteComplaint(id: number) {
  //   this.deleteComplaint(id).subscribe({
  //     next: () => console.log('Deleted successfully'),
  //     error: (err) => console.error('Delete failed', err)
  //   });
  // }


  // EditedComplaint(complaintId: number, data: ComplaintRequest) {
  //   this.updateComplaintStatus(complaintId, data).subscribe({
  //     next: (res) => console.log('Updated successfully', res),
  //     error: (err) => console.error('Update failed', err)
  //   });
  // }


  createComplaint(complaint: ComplaintRequest) {
    console.log('Creating complaint:', complaint);
    return this.http.post<ComplaintResponse>(this.apiUrl, complaint).pipe(
      tap((newC) => this.complaintsList.update(list => [newC, ...list]))
    );
  }

  updateComplaintStatus(complaintId: number, updatedComplaint: ComplaintRequest) {
    const url = `${this.apiUrl}/${complaintId}`;
    return this.http.put<ComplaintResponse>(url, updatedComplaint).pipe(
      tap((updatedRes) => {
        this.complaintsList.update(list => 
          list.map(c => c.id === complaintId ? updatedRes : c)
        );
      })
    );
  }


  getUserComplaints() {
    return this.http.get<ComplaintResponse[]>(this.apiUrl).pipe(
      tap((complaints) => {
        this.complaintsList.set(complaints);
      })
    );
  }

  deleteComplaint(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.complaintsList.update(list => list.filter(c => c.id !== id));
      })
    );
  }


  
}
