import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
  console.error(err.stack);
  res.status(500).send('Algo Salio Mal');
};

export function errorNotFound(err: Error, req: Request, res: Response, next: NextFunction){
    next(createHttpError(404, 'La ruta no existe'))
};