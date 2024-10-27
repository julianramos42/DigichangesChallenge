import Film from "../../models/Film";
import { FilmData } from "../../models/Film";

export default async function insertManyFilms(filmList: FilmData[]): Promise<number | null> {
    try {
        const saved = await Film.insertMany(filmList);
        if (saved) {
            console.log(`Peliculas guardadas con éxito: ${saved.length}`);
            return saved.length;
        }
    } catch (err) {
        console.error('Error al guardar peliculas: ', err)
        return null
    }
    return null
}