import Specie from "../../models/Specie";
import { SpecieData } from "../../models/Specie";

export default async function insertManySpecies(specieList: SpecieData[]): Promise<number | null> {
    try {
        const saved = await Specie.insertMany(specieList);
        if (saved) {
            console.log(`Especies guardadas con éxito: ${saved.length}`);
            return saved.length;
        }
    } catch (err) {
        console.error('Error al guardar especies: ', err)
        return null
    }
    return null
}