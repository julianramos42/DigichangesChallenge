import Planet from "../../models/Planet";
import { PlanetData } from "../../models/Planet";

export default async function checkDuplicates(data: PlanetData[]) {
    const filteredData = [];

    for (const item of data) {
        const exists = await Planet.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}