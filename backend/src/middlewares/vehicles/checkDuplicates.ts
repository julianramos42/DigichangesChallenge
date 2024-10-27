import Vehicle from "../../models/Vehicle";
import { VehicleData } from "../../models/Vehicle";

export default async function checkDuplicates(data: VehicleData[]) {
    const filteredData = [];

    for (const item of data) {
        const exists = await Vehicle.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}