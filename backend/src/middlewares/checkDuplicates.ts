import { Model } from "mongoose";

interface DuplicateCheckData {
    url: string;
}

export default async function checkDuplicates<T extends DuplicateCheckData>(model: Model<any>, data: T[]): Promise<T[]> {
    const filteredData: T[] = [];

    for (const item of data) {
        const exists = await model.exists({ url: item.url });
        if (!exists) {
            filteredData.push(item);
        }
    }

    return filteredData;
}