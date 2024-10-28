import axios, { AxiosResponse } from "axios";
import checkDuplicates from "../../middlewares/people/checkDuplicates";
import insertManyPeople from '../../services/people/create'
import { PeopleData } from "../../models/People";
//import replaceUrlsWithCustom from "../replaceUrlsWithCustom";

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PeopleData[];
}

export default async function createMany(url: string): Promise<void> {
    try {
        let nextUrl: string | null = url; // Comienza con la URL inicial
        let totalSaved = 0;

        do {
            const response: AxiosResponse<ApiResponse> = await axios.get(nextUrl);
            const data = response.data;
            const peopleList = data.results;

            // Reemplaza las url de la api por la nuestra
            //const peopleListWithOurURL = replaceUrlsWithCustom(peopleList);

            // Middleware para evitar repetir documentos
            const nonDuplicatedPeople = await checkDuplicates(peopleList);

            // Función encargada de guardar la lista en la BDD
            let res = await insertManyPeople(nonDuplicatedPeople);
            
            if(typeof res === 'number'){
                totalSaved += res;
            }

            nextUrl = data.next;
        } while (nextUrl);

        console.log(`Personas guardadas con éxito en total: ${totalSaved}`);

    } catch (err) {
        console.error('Error: ' + err);
    }
}