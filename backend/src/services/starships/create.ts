import Starship from "../../models/Starship";
import { StarshipData } from "../../models/Starship";

export default async function insertManyStarships(starshipList: StarshipData[]): Promise<number | null> {
    try {
        const saved = await Starship.insertMany(starshipList);
        if (saved) {
            console.log(`Naves guardadas con éxito: ${saved.length}`);
            return saved.length;
        }
    } catch (err) {
        console.error('Error al guardar naves: ', err)
        return null
    }
    return null
}