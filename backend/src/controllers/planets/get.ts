import { NextFunction, Request, Response } from "express";
import getPlanetsFromDB from "../../services/planets/getFromDB";

interface PlanetFilters {
    name?: RegExp;
    climate?: RegExp;
    terrain?: RegExp;
    url?: string;
}

export default async function getPlanets(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: PlanetFilters = {};

        let pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };

        let skip = (pagination.page - 1) * pagination.limit;

        if (typeof req.query.name === "string") {
            filter.name = new RegExp(req.query.name.trim(), "i");
        }

        if (typeof req.query.climate === "string") {
            filter.climate = new RegExp(req.query.climate.trim(), "i");
        }

        if (typeof req.query.terrain === "string") {
            filter.terrain = new RegExp(req.query.terrain.trim(), "i");
        }

        if (typeof req.query.url === "string") {
            filter.url = req.query.url;
        }

        const data = await getPlanetsFromDB({ filter, pagination, skip });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
