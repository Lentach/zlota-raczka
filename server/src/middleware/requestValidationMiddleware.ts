import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateServiceRequest = [
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Opis musi mieć minimum 10 znaków'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Lokalizacja jest wymagana'),
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Kontakt jest wymagany'),
  body('category')
    .trim()
    .isIn(['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'other'])
    .withMessage('Nieprawidłowa kategoria'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Nieprawidłowy priorytet'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateRequestUpdate = [
  body('status')
    .isIn(['New', 'InProgress', 'Completed', 'Cancelled'])
    .withMessage('Nieprawidłowy status'),
  body('handymanId')
    .optional()
    .isMongoId()
    .withMessage('Nieprawidłowe ID wykonawcy'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notatki nie mogą przekraczać 500 znaków'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 