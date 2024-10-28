import express from 'express';
import 'dotenv/config.js'
import '../config/database'
import { errorHandler, errorNotFound } from './middlewares/errors';
import indexRouter from './routes/index';
import cronJob from './cron';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors())

app.use('/api', indexRouter);

cronJob.start();

app.use(errorHandler);
app.use(errorNotFound);

export default app;