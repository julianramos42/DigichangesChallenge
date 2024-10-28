import { NextFunction, Request, Response } from "express";
import getPeopleFromDB from "../../services/people/getFromDB";

interface PeopleFilters {
    name?: RegExp;
    height?: RegExp;
    mass?: RegExp;
    gender?: RegExp;
}

export default async function getPeople(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: PeopleFilters = {};

        let pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };

        let skip = (pagination.page - 1) * pagination.limit;

        if (typeof req.query.mass === "string") {
            filter.mass = new RegExp(req.query.mass.trim(), "i");
        }

        if (typeof req.query.height === "string") {
            filter.height = new RegExp(req.query.height.trim(), "i");
        }

        if (typeof req.query.name === "string") {
            filter.name = new RegExp(req.query.name.trim(), "i");
        }

        if (typeof req.query.gender === "string") {
            filter.gender = new RegExp(req.query.gender.trim(), "i");
        }

        const data = await getPeopleFromDB({ filter, pagination, skip });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
