
export enum ComplaintStatus {
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    REJECTED = 'REJECTED'
}

export interface ComplaintResponse {
    id: number;
    title: string;
    description: string;
    complaintType: string;
    severity: string;
    status: ComplaintStatus; 
    ticketId: string;
    ticketTitle: string;
    userId: string;
    userEmail: string;
    userName: string;
    response: string;
    respondedById: string;
    respondedByName: string;
    createdAt: string;
    resolvedAt: string;
}