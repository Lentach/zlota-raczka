import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Wystąpił błąd serwera';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Ten użytkownik już istnieje';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Nieprawidłowy token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token wygasł';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Nie znaleziono - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
}; 