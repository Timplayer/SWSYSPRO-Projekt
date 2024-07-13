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

export enum Transmission{
    Automatik = "Automatik",
    Manuell = "Manuell",
}

export interface VehicleType{
    id : number,
    name : string,
    vehicleCategory : number,
    transmission : Transmission,
    maxSeatCount : number,
    pricePerHour : number,
}

export interface VehicleCategory {
    id: number;
    name: string;
}

export interface Producer {
    id: number;
    name: string;
}
