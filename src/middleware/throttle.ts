import slowDown from 'express-slow-down';

export const throttle = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 400,
  delayMs: () => 500,
});
