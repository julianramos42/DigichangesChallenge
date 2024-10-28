import express from 'express';
import 'dotenv/config.js'
import '../config/database'
import { errorHandler, errorNotFound } from './middlewares/errors';
import indexRouter from './routes/index';
import cronJob from './cron';

const app = express();

app.use(express.json());

app.use('/api', indexRouter);

cronJob.start();

app.use(errorHandler);
app.use(errorNotFound);

export default app;