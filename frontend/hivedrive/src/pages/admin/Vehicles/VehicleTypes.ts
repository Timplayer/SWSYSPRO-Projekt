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

export interface VehicleCategory {
    id: number;
    name: string;
}

export interface Producer {
    id: number;
    name: string;
}
