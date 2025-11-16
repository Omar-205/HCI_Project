export interface Ticket {
  id?: string;          // optinal because we could generate it in backend instead
  userId: string;
  type: "bus" | "train" | "metro";

  from: string;
  to: string;

  date: string;
  time: string;

  price: number;
  seatNumber?: string;
  status: "active" | "used" | "canceled";
  qrCode?: {
    data: string;
    createdAt: string;
  };
}
