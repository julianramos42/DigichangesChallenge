import Vehicle from "../../models/Vehicle";
import { VehicleData } from "../../models/Vehicle";

export default async function insertManyVehicles(vehicleList: VehicleData[]): Promise<number | null> {
    try {
        const saved = await Vehicle.insertMany(vehicleList);
        if (saved) {
            console.log(`Vehiculos guardados con éxito: ${saved.length}`);
            return saved.length;
        }
    } catch (err) {
        console.error('Error al guardar vehiculos: ', err)
        return null
    }
    return null
}