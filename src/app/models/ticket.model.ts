export interface Ticket {


  category: "bus" | "tram" | "metro";

  fromPlace: string;
  toPlace: string;
  description: string;

  time: string;

  price: number;
  seatNumber?: string;
  status: "active" | "used" | "canceled";
  qrCode?: {
    data: string;
    createdAt: string;
  };
}
