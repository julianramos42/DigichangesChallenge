import axios, { AxiosResponse } from "axios";
import checkDuplicates from "../../middlewares/planets/checkDuplicates";
import insertManyPlanets from "../../services/planets/create";
import { PlanetData } from "../../models/Planet";
//import replaceUrlsWithCustom from "../replaceUrlsWithCustom";

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PlanetData[];
}

export default async function createMany(url: string): Promise<void> {
    try {
        let nextUrl: string | null = url; // Comienza con la URL inicial
        let totalSaved = 0;

        do {
            const response: AxiosResponse<ApiResponse> = await axios.get(nextUrl);
            const data = response.data;
            const planetList = data.results;

            // Reemplaza las url de la api por la nuestra
            //const planetListWithOurURL = replaceUrlsWithCustom(planetList);

            // Middleware para evitar repetir documentos
            const nonDuplicatedPeople = await checkDuplicates(planetList);

            // Función encargada de guardar la lista en la BDD
            let res = await insertManyPlanets(nonDuplicatedPeople);
            if(typeof res === 'number'){
                totalSaved += res;
            }

            nextUrl = data.next;
        } while (nextUrl);

        console.log(`Planetas guardados con éxito en total: ${totalSaved}`);

    } catch (err) {
        console.error('Error: ' + err);
    }
}