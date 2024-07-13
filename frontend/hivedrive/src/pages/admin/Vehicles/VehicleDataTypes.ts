// types.ts
export interface Vehicle {
    id: number;
    name: string;
    vehicleCategory: number;
    producer: number;
    status: string;
    receptionDate: string;
    completionDate: string;
}
export enum Transmission {
    Automatik = "Automatik",
    Manuell = "Manuell",
}

export enum DriverSystem {
    FWD = "FWD",
    RWD = "RWD",
    AWD = "AWD",
}

export interface VehicleType {
    id?: number;
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
