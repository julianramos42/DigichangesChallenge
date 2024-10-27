import axios, { AxiosResponse } from "axios";
import checkDuplicates from "../../middlewares/films/checkDuplicates";
import insertManyFilms from "../../services/films/create";
import { FilmData } from "../../models/Film";

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: FilmData[];
}

export default async function createMany(url: string): Promise<void> {
    try {
        let nextUrl: string | null = url; // Comienza con la URL inicial
        let totalSaved = 0;

        do {
            const response: AxiosResponse<ApiResponse> = await axios.get(nextUrl);
            const data = response.data;
            const filmList = data.results;

            // Middleware para evitar repetir documentos
            const nonDuplicatedPeople = await checkDuplicates(filmList);

            // Función encargada de guardar la lista en la BDD
            let res = await insertManyFilms(nonDuplicatedPeople);
            if(typeof res === 'number'){
                totalSaved += res;
            }

            nextUrl = data.next;
        } while (nextUrl);

        console.log(`Peliculas guardadas con éxito en total: ${totalSaved}`);

    } catch (err) {
        console.error('Error: ' + err);
    }
}