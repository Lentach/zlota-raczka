import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nazwa użytkownika musi mieć minimum 3 znaki'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Podaj prawidłowy adres email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Hasło musi mieć minimum 6 znaków'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Imię i nazwisko jest wymagane'),
  body('role')
    .optional()
    .isIn(['client', 'handyman'])
    .withMessage('Nieprawidłowa rola użytkownika'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Nazwa użytkownika jest wymagana'),
  body('password')
    .notEmpty()
    .withMessage('Hasło jest wymagane'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Imię i nazwisko nie może być puste'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\s-]{9,}$/)
    .withMessage('Podaj prawidłowy numer telefonu'),
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Adres nie może być pusty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 