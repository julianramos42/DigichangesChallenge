import Planet from "../../models/Planet";
import { PlanetData } from "../../models/Planet";

export default async function insertManyPlanets(planetList: PlanetData[]): Promise<number | null> {
    try {
        const saved = await Planet.insertMany(planetList);
        if (saved) {
            console.log(`Planetas guardadas con éxito: ${saved.length}`);
            return saved.length;
        }
    } catch (err) {
        console.error('Error al guardar planetas: ', err)
        return null
    }
    return null
}