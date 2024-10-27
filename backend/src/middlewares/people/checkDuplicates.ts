import People from "../../models/People";
import { PeopleData } from "../../models/People";

export default async function checkDuplicates(data: PeopleData[]) {
    const filteredData = [];

    for (const item of data) {
        const exists = await People.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}