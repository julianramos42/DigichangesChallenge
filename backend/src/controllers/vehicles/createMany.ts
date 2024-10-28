import axios, { AxiosResponse } from "axios";
import checkDuplicates from "../../middlewares/vehicles/checkDuplicates";
import insertManyVehicles from "../../services/vehicles/create";
import { VehicleData } from "../../models/Vehicle";
import replaceUrlsWithCustom from "../replaceUrlsWithCustom";

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: VehicleData[];
}

export default async function createMany(url: string): Promise<void> {
    try {
        let nextUrl: string | null = url; // Comienza con la URL inicial
        let totalSaved = 0;

        do {
            const response: AxiosResponse<ApiResponse> = await axios.get(nextUrl);
            const data = response.data;
            const vehicleList = data.results;

            // Reemplaza las url de la api por la nuestra
            const vehicleListWithOurURL = replaceUrlsWithCustom(vehicleList);

            // Middleware para evitar repetir documentos
            const nonDuplicatedPeople = await checkDuplicates(vehicleListWithOurURL);

            // Función encargada de guardar la lista en la BDD
            let res = await insertManyVehicles(nonDuplicatedPeople);
            if(typeof res === 'number'){
                totalSaved += res;
            }

            nextUrl = data.next;
        } while (nextUrl);

        console.log(`Vehiculos guardadas con éxito en total: ${totalSaved}`);

    } catch (err) {
        console.error('Error: ' + err);
    }
}