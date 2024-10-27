import Specie from "../../models/Specie";
import { SpecieData } from "../../models/Specie";

export default async function checkDuplicates(data: SpecieData[]) {
    const filteredData = [];

    for (const item of data) {
        const exists = await Specie.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}