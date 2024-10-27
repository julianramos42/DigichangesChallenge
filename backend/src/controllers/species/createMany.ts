import axios, { AxiosResponse } from "axios";
import checkDuplicates from "../../middlewares/species/checkDuplicates";
import insertManySpecies from "../../services/species/create";
import { SpecieData } from "../../models/Specie";

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SpecieData[];
}

export default async function createMany(url: string): Promise<void> {
    try {
        let nextUrl: string | null = url; // Comienza con la URL inicial
        let totalSaved = 0;

        do {
            const response: AxiosResponse<ApiResponse> = await axios.get(nextUrl);
            const data = response.data;
            const specieList = data.results;

            // Middleware para evitar repetir documentos
            const nonDuplicatedPeople = await checkDuplicates(specieList);

            // Función encargada de guardar la lista en la BDD
            let res = await insertManySpecies(nonDuplicatedPeople);
            if(typeof res === 'number'){
                totalSaved += res;
            }

            nextUrl = data.next;
        } while (nextUrl);

        console.log(`Especies guardadas con éxito en total: ${totalSaved}`);

    } catch (err) {
        console.error('Error: ' + err);
    }
}