import express from 'express';
import peopleRouter from './people';
import planetRouter from './planets';
import filmRouter from './films';
import speciesRouter from './species';
import starshipsRouter from './starships';
import vehiclesRouter from './vehicles';

let router = express.Router();

router.use('/people', peopleRouter);
router.use('/planets', planetRouter);
router.use('/films', filmRouter);
router.use('/species', speciesRouter);
router.use('/starships', starshipsRouter);
router.use('/vehicles', vehiclesRouter);

export default router;