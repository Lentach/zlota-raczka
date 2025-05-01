import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Zbyt wiele żądań z tego adresu IP, spróbuj ponownie później'
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Zbyt wiele prób logowania, spróbuj ponownie za godzinę'
});

// Limiter for request creation
export const requestCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Zbyt wiele zgłoszeń, spróbuj ponownie za godzinę'
}); 