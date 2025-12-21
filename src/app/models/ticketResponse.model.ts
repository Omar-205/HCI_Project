export interface TicketResponse {
  id: number;
  category: "bus" | "tram" | "metro";
  fromPlace: string;
  toPlace: string;
  description: string;
  status: "active" | "used" | "canceled" | string;
  price: number;
  createdAt: string;
}
