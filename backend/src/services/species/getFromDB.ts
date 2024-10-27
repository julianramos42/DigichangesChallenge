import Specie from "../../models/Specie"

interface OptionsData {
    filter: Object,
    pagination: {
        page: number,
        limit: number
    },
    skip: number
}

export default async function getSpeciesFromDB(options: OptionsData) {
    try {
        const { filter, pagination, skip } = options

        const totalCount = await Specie.countDocuments(filter);
        const specie = await Specie.find(filter)
            .skip(skip)
            .limit(pagination.limit > 0 ? pagination.limit : 0)

        const totalPages = Math.ceil(totalCount / pagination.limit);
        const nextPage = pagination.page < totalPages ? `${process.env.OUR_URL}/api/species/?page=${pagination.page + 1}` : null;
        const previousPage = pagination.page > 1 ? `${process.env.OUR_URL}/api/species/?page=${pagination.page - 1}` : null;

        if (specie) {
            return {
                success: true,
                count: totalPages,
                next: nextPage,
                previous: previousPage,
                results: specie || [],
                status: 200
            };
        }

        return {
            success: false,
            count: totalPages || null,
            next: nextPage || null,
            previous: previousPage || null,
            results: specie || [],
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