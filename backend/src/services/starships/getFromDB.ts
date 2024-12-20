import { SortOrder } from "mongoose";
import Starship from "../../models/Starship"

interface OptionsData {
    filter: Object,
    pagination: {
        page: number,
        limit: number
    },
    skip: number,
    sort: { [key: string]: SortOrder }
}

export default async function getStarshipsFromDB(options: OptionsData) {
    try {
        const { filter, pagination, skip, sort } = options

        const totalCount = await Starship.countDocuments(filter);
        const starship = await Starship.find(filter)
            .skip(skip)
            .limit(pagination.limit > 0 ? pagination.limit : 0)
            .sort(sort)

        const totalPages = Math.ceil(totalCount / pagination.limit);
        const nextPage = pagination.page < totalPages ? `${process.env.OUR_URL}/api/starships/?page=${pagination.page + 1}` : null;
        const previousPage = pagination.page > 1 ? `${process.env.OUR_URL}/api/starships/?page=${pagination.page - 1}` : null;

        if (starship.length) {
            return {
                success: true,
                count: totalCount,
                next: nextPage,
                previous: previousPage,
                results: starship || [],
                status: 200
            };
        }

        return {
            success: false,
            count: totalCount || 0,
            next: nextPage || null,
            previous: previousPage || null,
            results: starship || [],
            status: 404
        };

    } catch (err) {
        console.log("Error: " + err);
    }

    return {
        success: false,
        count: 0,
        next: null,
        previous: null,
        results: [],
        status: 404
    };
}