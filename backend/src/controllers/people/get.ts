import { NextFunction, Request, Response } from "express";
import getPeopleFromDB from "../../services/people/getFromDB";

interface PeopleFilters {
    name?: RegExp;
    height?: number;
    mass?: number;
    hair_color?: RegExp;
    skin_color?: RegExp;
    eye_color?: RegExp;
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

        if (typeof req.query.height === "number") {
            filter.height = req.query.height;
        }

        if (typeof req.query.mass === "number") {
            filter.mass = req.query.mass;
        }

        if (typeof req.query.name === "string") {
            filter.name = new RegExp(req.query.name.trim(), "i");
        }

        if (typeof req.query.hair_color === "string") {
            filter.hair_color = new RegExp(req.query.hair_color.trim(), "i");
        }

        if (typeof req.query.skin_color === "string") {
            filter.skin_color = new RegExp(req.query.skin_color.trim(), "i");
        }

        if (typeof req.query.eye_color === "string") {
            filter.eye_color = new RegExp(req.query.eye_color.trim(), "i");
        }

        if (typeof req.query.birth_year === "string") {
            filter.birth_year = new RegExp(req.query.birth_year.trim(), "i");
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
