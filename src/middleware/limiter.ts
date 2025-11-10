import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  message: 'Muitas tentativas. Aguarde 15 minutos',
});
