import express from "express";
import getVehicles from "../controllers/vehicles/get";

let router = express.Router();

router.get('/', getVehicles);

export default router;