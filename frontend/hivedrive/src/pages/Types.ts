export interface Car {
  id : number;
  name: string;
  vehicleCategory : number;
  transmission: string;
  maxSeatCount: number;
  pricePerHour: number; // in cent
  images: string[];
}