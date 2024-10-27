import Starship from "../../models/Starship";
import { StarshipData } from "../../models/Starship";

export default async function checkDuplicates(data: StarshipData[]) {
    const filteredData = [];

    for (const item of data) {
        const exists = await Starship.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}