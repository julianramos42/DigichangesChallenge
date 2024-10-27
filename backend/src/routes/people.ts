import express from "express";
import getPeople from "../controllers/people/get";

let router = express.Router();

router.get('/', getPeople);

export default router;