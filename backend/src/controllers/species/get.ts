import { NextFunction, Request, Response } from "express";
import getSpeciesFromDB from "../../services/species/getFromDB";

interface SpeciesFilters {
    name?: RegExp;
    classification?: RegExp;
    designation?: RegExp;
    language?: RegExp;
    url?: string;
}

export default async function getSpecies(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: SpeciesFilters = {};

        let pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };

        let skip = (pagination.page - 1) * pagination.limit;

        if (typeof req.query.name === "string") {
            filter.name = new RegExp(req.query.name.trim(), "i");
        }

        if (typeof req.query.classification === "string") {
            filter.classification = new RegExp(req.query.classification.trim(), "i");
        }

        if (typeof req.query.designation === "string") {
            filter.designation = new RegExp(req.query.designation.trim(), "i");
        }

        if (typeof req.query.language === "string") {
            filter.language = new RegExp(req.query.language.trim(), "i");
        }

        if (typeof req.query.url === "string") {
            filter.url = req.query.url;
        }

        const data = await getSpeciesFromDB({ filter, pagination, skip });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
