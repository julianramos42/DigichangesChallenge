import Film from "../../models/Film"

interface OptionsData {
    filter: Object,
    pagination: {
        page: number,
        limit: number
    },
    skip: number
}

export default async function getFilmsFromDB(options: OptionsData) {
    try {
        const { filter, pagination, skip } = options

        const totalCount = await Film.countDocuments(filter);
        const film = await Film.find(filter)
            .skip(skip)
            .limit(pagination.limit > 0 ? pagination.limit : 0)

        const totalPages = Math.ceil(totalCount / pagination.limit);
        const nextPage = pagination.page < totalPages ? `${process.env.OUR_URL}/api/films/?page=${pagination.page + 1}` : null;
        const previousPage = pagination.page > 1 ? `${process.env.OUR_URL}/api/films/?page=${pagination.page - 1}` : null;

        if (film) {
            return {
                success: true,
                count: totalCount,
                next: nextPage,
                previous: previousPage,
                results: film || [],
                status: 200
            };
        }

        return {
            success: false,
            count: totalCount || 0,
            next: nextPage || null,
            previous: previousPage || null,
            results: film || [],
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