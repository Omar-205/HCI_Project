export interface CreateTicketRequest {
  category: "bus" | "tram" | "metro";
  fromPlace: string;
  toPlace: string;
  description: string;
  price: number;
  status:string;
}

