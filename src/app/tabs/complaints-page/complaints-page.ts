import { Component , computed, inject , signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { LucideAngularModule, Home, Calendar, AlertCircle, ChevronRight, ClipboardX, MessageCircle } from 'lucide-angular';
import { ComplaintService } from '../../components/Service/complaint.service';
import { ComplaintStatus } from '../../models/ComplaintResponse';
@Component({
  selector: 'app-complaints-page',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './complaints-page.html',
  styleUrl: './complaints-page.css',
})
export class ComplaintsPage {
  complaintService = inject(ComplaintService);
  public  ComplaintStatus = ComplaintStatus;
  readonly ContactIcon = MessageCircle;
  readonly CalendarIcon = Calendar;
  readonly AlertIcon = AlertCircle;
  readonly ChevronIcon = ChevronRight;
  readonly ClipboardIcon = ClipboardX;

  filterTabs = ['All Complaints', 'Active', 'Resolved'];
  activeFilter = signal('All Complaints');

  currentlyDisplayedComplaints = computed(() => {
    switch (this.activeFilter()) {
      case 'Active':
        return this.complaintService.activeListComplaint();
      case 'Resolved':
        return this.complaintService.resolvedListComplaint();
      default:
        return this.complaintService.complaintsList();
    }
  });

  getSeverityClass(severity: string) {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/40';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/40';
      case 'low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/40';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/40';
    }
  }
}