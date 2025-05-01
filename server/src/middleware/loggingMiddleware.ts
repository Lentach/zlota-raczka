import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(
  path.join(__dirname, '../../logs/api.log'),
  { flags: 'a' }
);

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || 'unknown';
  const userId = (req as any).user?._id || 'anonymous';

  const logEntry = {
    timestamp,
    method,
    url: originalUrl,
    ip,
    userAgent,
    userId
  };

  logStream.write(JSON.stringify(logEntry) + '\n');
  next();
};

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || 'unknown';
  const userId = (req as any).user?._id || 'anonymous';

  const logEntry = {
    timestamp,
    method,
    url: originalUrl,
    ip,
    userAgent,
    userId,
    error: {
      message: err.message,
      stack: err.stack
    }
  };

  logStream.write(JSON.stringify(logEntry) + '\n');
  next(err);
}; 