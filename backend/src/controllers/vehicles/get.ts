import { NextFunction, Request, Response } from "express";
import getVehiclesFromDB from "../../services/vehicles/getFromDB";
import { SortOrder } from "mongoose";

interface VehiclesFilters {
    name?: RegExp;
    model?: RegExp;
    vehicle_class?: RegExp;
    manufacturer?: RegExp;
    url?: string;
}

export default async function getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
        let filter: VehiclesFilters = {};

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

        if (typeof req.query.vehicle_class === "string") {
            filter.vehicle_class = new RegExp(req.query.vehicle_class.trim(), "i");
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

        // Verifica el orden para cargo_capacity
        if (Number(req.query.cargo_capacity) === 1) { // ASC
            sort.cargo_capacity = 1;
        } else if (Number(req.query.cargo_capacity) === 0) { // DES
            sort.cargo_capacity = -1;
        }

        if (typeof req.query.url === "string") {
            filter.url = `https://swapi.dev/api/vehicles/${req.query.url}/`;
        }

        const data = await getVehiclesFromDB({ filter, pagination, skip, sort });

        res.status(data.status).json(data);

    } catch (err) {
        next(err);
    }
}
