import express from "express";
import getFilms from "../controllers/films/get";

let router = express.Router();

router.get('/', getFilms);

export default router;