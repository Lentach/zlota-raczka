import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Brak tokenu, dostęp zabroniony' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'Użytkownik nie znaleziony' });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Błąd weryfikacji tokenu:', error);
    res.status(401).json({ message: 'Nieprawidłowy token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Brak autoryzacji' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Brak uprawnień do wykonania tej operacji' });
      return;
    }

    next();
  };
}; 