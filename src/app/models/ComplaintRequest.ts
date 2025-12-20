export enum ComplaintType {
    SERVICE_QUALITY="SERVICE_QUALITY",
    SAFETY_ISSUE="SAFETY_ISSUE",
    PRICING_ISSUE="PRICING_ISSUE",
    DRIVER_BEHAVIOR="DRIVER_BEHAVIOR",
    VEHICLE_CONDITION="VEHICLE_CONDITION",
    ROUTE_PROBLEM="ROUTE_PROBLEM",
    DELAY="DELAY",
    CANCELLATION="CANCELLATION",
    CLEANLINESS="CLEANLINESS",
    OTHER="OTHER"
}


export enum ComplaintSeverity {
    LOW="LOW",
    MEDIUM="MEDIUM",
    HIGH="HIGH",
    CRITICAL="CRITICAL"
}

export interface ComplaintRequest {
    title: string;
    description: string;
    complaintType: ComplaintType;
    ticketId: string;
    severity: ComplaintSeverity;
}