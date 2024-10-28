import { NextFunction, Request, Response } from "express";
import getPeopleFromDB from "../../services/people/getFromDB";

interface PeopleFilters {
    name?: RegExp;
    gender?: string;
    url?: string;
}

export default async function getPeople(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: PeopleFilters = {};

        let pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };

        let skip = (pagination.page - 1) * pagination.limit;

        if (typeof req.query.name === "string") {
            filter.name = new RegExp(req.query.name.trim(), "i");
        }

        if (typeof req.query.gender === "string") {
            filter.gender = req.query.gender;
        }

        if (typeof req.query.url === "string") {
            filter.url = req.query.url;
        }

        const data = await getPeopleFromDB({ filter, pagination, skip });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
