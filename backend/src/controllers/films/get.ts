import { NextFunction, Request, Response } from "express";
import getFilmsFromDB from "../../services/films/getFromDB";

interface FilmFilters {
    title?: RegExp;
    episode_id?: number;
    director?: RegExp;
    producer?: RegExp;
    release_date?: { $gte?: Date; $lte?: Date }; // Filtro para rango de fechas
    url?: string;
}

export default async function getFilms(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: FilmFilters = {};

        let pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };

        let skip = (pagination.page - 1) * pagination.limit;

        if (typeof req.query.title === "string") {
            filter.title = new RegExp(req.query.title.trim(), "i");
        }

        if (typeof req.query.director === "string") {
            filter.director = new RegExp(req.query.director.trim(), "i");
        }

        if (typeof req.query.producer === "string") {
            filter.producer = new RegExp(req.query.producer.trim(), "i");
        }

        // Filtro por año exacto
        if (typeof req.query.release_date === "string") {
            const year = parseInt(req.query.release_date);
            if (!isNaN(year)) { // Verifica que sea un número válido
                const startDate = new Date(year, 0, 1); // 1 de enero del año
                const endDate = new Date(year + 1, 0, 1); // 1 de enero del año siguiente
                filter.release_date = { $gte: startDate, $lte: endDate }; // Rango de fechas para el año
            }
        }

        if (typeof req.query.url === "string") {
            filter.url = req.query.url;
        }

        const data = await getFilmsFromDB({ filter, pagination, skip });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
