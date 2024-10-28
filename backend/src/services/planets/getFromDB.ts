import Planet from "../../models/Planet"

interface OptionsData {
    filter: Object,
    pagination: {
        page: number,
        limit: number
    },
    skip: number
}

export default async function getPlanetsFromDB(options: OptionsData) {
    try {
        const { filter, pagination, skip } = options

        const totalCount = await Planet.countDocuments(filter);
        const planet = await Planet.find(filter)
            .skip(skip)
            .limit(pagination.limit > 0 ? pagination.limit : 0)

        const totalPages = Math.ceil(totalCount / pagination.limit);
        const nextPage = pagination.page < totalPages ? `${process.env.OUR_URL}/api/planets/?page=${pagination.page + 1}` : null;
        const previousPage = pagination.page > 1 ? `${process.env.OUR_URL}/api/planets/?page=${pagination.page - 1}` : null;

        if (planet.length) {
            return {
                success: true,
                count: totalCount,
                next: nextPage,
                previous: previousPage,
                results: planet || [],
                status: 200
            };
        }

        return {
            success: false,
            count: totalCount || 0,
            next: nextPage || null,
            previous: previousPage || null,
            results: planet || [],
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