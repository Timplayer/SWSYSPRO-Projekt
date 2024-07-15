
export interface Vehicle {
    id: number;
    name: string;
    vehicleCategory: number;
    producer: number;
    status: string;
    receptionDate: string;
    completionDate: string;
    images? : string[]
}
export enum Transmission {
    Automatik = "automatic",
    Manuell = "manual",
}

export enum DriverSystem {
    FWD = "fwd",
    RWD = "rwd",
    AWD = "awd",
}

export interface VehicleType {
    id: number;
    name: string;
    vehicleCategory: number;
    transmission: Transmission;
    driverSystem: DriverSystem; 
    maxSeatCount: number;
    pricePerHour: number;
    minAgeToDrive: number; 
}
export interface VehicleCategory {
    id: number;
    name: string;
}

export interface Producer {
    id: number;
    name: string;
}

export interface Reservation{
  id : number,  
  start_zeit: Date,
  start_station: number,
  end_zeit: Date,
  end_station: number,
  auto_klasse: number,
}

export interface Availability{
    time : Date,
    pos : number,
    auto_klasse : number,
    availability : number,
}