import express from "express";
import getPlanets from "../controllers/planets/get";

let router = express.Router();

router.get('/', getPlanets);

export default router;