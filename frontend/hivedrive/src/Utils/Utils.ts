import { Availability } from "../Types";

export const checkAvilableVehicaleTypes = (
    availabilitys: Availability[],
    pickupDate?: Date
  ): Array<number> => 
{
    let vehicleTypes = new Map<number, {date: Date, count: number}>();
        
    for (const availability of availabilitys) {
        if(pickupDate && new Date(availability.time) >= new Date(pickupDate)){
            continue;
        }
        if (!vehicleTypes.has(availability.auto_klasse)) {
            vehicleTypes.set(availability.auto_klasse, { 
              date: new Date(availability.time),
              count: availability.availability,
            });
        }
        else 
        {
            const existingEntry = vehicleTypes.get(availability.auto_klasse);
    
            if (existingEntry && new Date(existingEntry.date) < new Date(availability.time)) {
              vehicleTypes.set(availability.auto_klasse, {
                date: new Date(availability.time),
                count: availability.availability,
              });
            }
        }
    }
    const availabilityVehicleTypes = Array.from(vehicleTypes.keys()).filter((id: number) => {
        const type = vehicleTypes.get(id);
        return type && type.count > 0;
    });
    return availabilityVehicleTypes;
};