import express from "express";
import getStarships from "../controllers/starships/get";

let router = express.Router();

router.get('/', getStarships);

export default router;