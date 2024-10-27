import express from "express";
import getSpecies from "../controllers/species/get";

let router = express.Router();

router.get('/', getSpecies);

export default router;