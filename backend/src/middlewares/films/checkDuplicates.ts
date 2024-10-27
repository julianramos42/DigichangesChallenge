import Film from "../../models/Film";
import { FilmData } from "../../models/Film";

export default async function checkDuplicates(data: FilmData[]) {
    const filteredData = [];

    for (const item of data) {
        const exists = await Film.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}