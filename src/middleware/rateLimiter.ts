import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 400,
  message: {
    status: 429,
    message: 'Muitas requisições desse IP , tente de novo mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
