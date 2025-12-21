export interface UpdateTicketModel {
  description: string;
  status: "active" | "used" | "canceled";
  category: "bus" | "tram" | "metro";
  fromPlace: string;
  toPlace: string;
  price: number;
}
