import { SortOrder } from "mongoose";
import Vehicle from "../../models/Vehicle"

interface OptionsData {
    filter: Object,
    pagination: {
        page: number,
        limit: number
    },
    skip: number,
    sort: { [key: string]: SortOrder }
}

export default async function getVehiclesFromDB(options: OptionsData) {
    try {
        const { filter, pagination, skip, sort } = options

        const totalCount = await Vehicle.countDocuments(filter);
        const vehicle = await Vehicle.find(filter)
            .skip(skip)
            .limit(pagination.limit > 0 ? pagination.limit : 0)
            .sort(sort)

        const totalPages = Math.ceil(totalCount / pagination.limit);
        const nextPage = pagination.page < totalPages ? `${process.env.OUR_URL}/api/vehicles/?page=${pagination.page + 1}` : null;
        const previousPage = pagination.page > 1 ? `${process.env.OUR_URL}/api/vehicles/?page=${pagination.page - 1}` : null;

        if (vehicle) {
            return {
                success: true,
                count: totalPages,
                next: nextPage,
                previous: previousPage,
                results: vehicle || [],
                status: 200
            };
        }

        return {
            success: false,
            count: totalPages || null,
            next: nextPage || null,
            previous: previousPage || null,
            results: vehicle || [],
            status: 404
        };

    } catch (err) {
        console.log("Error: " + err);
    }

    return {
        success: false,
        count: null,
        next: null,
        previous: null,
        results: [],
        status: 404
    };
}