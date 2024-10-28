import { NextFunction, Request, Response } from "express";
import getStarshipsFromDB from "../../services/starships/getFromDB";
import { SortOrder } from "mongoose";

interface StarshipFilters {
    name?: RegExp;
    model?: RegExp;
    starship_class?: RegExp;
    manufacturer?: RegExp;
}

export default async function getStarships(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: StarshipFilters = {};

        let pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };

        let skip = (pagination.page - 1) * pagination.limit;

        if (typeof req.query.name === "string") {
            filter.name = new RegExp(req.query.name.trim(), "i");
        }

        if (typeof req.query.model === "string") {
            filter.model = new RegExp(req.query.model.trim(), "i");
        }

        if (typeof req.query.starship_class === "string") {
            filter.starship_class = new RegExp(req.query.starship_class.trim(), "i");
        }

        if (typeof req.query.manufacturer === "string") {
            filter.manufacturer = new RegExp(req.query.manufacturer.trim(), "i");
        }

        let sort: { [key: string]: SortOrder } = {};

        // Verifica el orden para cost_in_credits
        if (Number(req.query.cost_in_credits) === 1) { // ASC
            sort.cost_in_credits = 1;
        } else if (Number(req.query.cost_in_credits) === 0) { // DES
            sort.cost_in_credits = -1;
        }

        const data = await getStarshipsFromDB({ filter, pagination, skip, sort });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
