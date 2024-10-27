import People from "../../models/People";
import { PeopleData } from "../../models/People";

export default async function insertManyPeople(peopleList: PeopleData[]): Promise<number | null> {
    try {
        const saved = await People.insertMany(peopleList);
        if (saved) {
            console.log(`Personas guardadas con éxito: ${saved.length}`);
            return saved.length;
        }
    } catch (err) {
        console.error('Error al guardar personas: ', err)
        return null
    }
    return null
}