import axios, { AxiosResponse } from "axios";
import checkDuplicates from "../../middlewares/starships/checkDuplicates";
import insertManyStarships from "../../services/starships/create";
import { StarshipData } from "../../models/Starship";
import replaceUrlsWithCustom from "../replaceUrlsWithCustom";

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: StarshipData[];
}

export default async function createMany(url: string): Promise<void> {
    try {
        let nextUrl: string | null = url; // Comienza con la URL inicial
        let totalSaved = 0;

        do {
            const response: AxiosResponse<ApiResponse> = await axios.get(nextUrl);
            const data = response.data;
            const starshipList = data.results;

            // Reemplaza las url de la api por la nuestra
            const starshipListWithOurURL = replaceUrlsWithCustom(starshipList);

            // Middleware para evitar repetir documentos
            const nonDuplicatedPeople = await checkDuplicates(starshipListWithOurURL);

            // Función encargada de guardar la lista en la BDD
            let res = await insertManyStarships(nonDuplicatedPeople);
            if(typeof res === 'number'){
                totalSaved += res;
            }

            nextUrl = data.next;
        } while (nextUrl);

        console.log(`Naves guardadas con éxito en total: ${totalSaved}`);

    } catch (err) {
        console.error('Error: ' + err);
    }
}