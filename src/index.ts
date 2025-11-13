import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import RegisterUserController from './controllers/RegisterUserController';
import LoginUserController from './controllers/LoginUserController';
import VerifyAdmin from './middleware/VerifyAdmin';
import AdminController from './controllers/AdminController';
import ForgotPasswordController from './controllers/ForgotPasswordController';
import ResetPasswordController from './controllers/ResetPasswordController';
import DeleteUserController from './controllers/DeleteUserController';
import { rateLimiter } from './middleware/rateLimiter';
import { throttle } from './middleware/throttle';
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/limiter';
import { jwtVerify } from './utils/token';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
const register = new RegisterUserController();
const login = new LoginUserController();
const verifyAdmin = new VerifyAdmin();
const adminController = new AdminController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();
const deleteUserController = new DeleteUserController();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);
app.use(throttle);
app.use(
  cors({
    origin: 'https://somewhere-to.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.post('/api/v1/register', limiter, register.handleRegister);
app.post('/api/v1/login', login.handleLogin);
app.post('/api/v1/admin', verifyAdmin.handle, adminController.handle);
app.patch(
  '/api/v1/admin/user/:id',
  verifyAdmin.handle,
  adminController.updateUser,
);
app.post(
  '/api/v1/forgot-password',
  limiter,
  forgotPasswordController.handleForgot,
);
app.patch(
  '/api/v1/reset-password',
  limiter,
  resetPasswordController.handleResetPassword,
  resetPasswordController.updatePasswordHash,
);
app.delete('/api/v1/delete', deleteUserController.handle);

app.post(
  '/api/v1/user',
  (request: Request, response: Response, next: NextFunction) => {
    const cookieToken = request.cookies.token;
    response.locals.cookie = cookieToken;
    next();
  },
  (request: Request, response: Response) => {
    try {
      const tokenVerified = jwtVerify(response.locals.cookie);
      if (
        (typeof tokenVerified !== 'string' &&
          tokenVerified.status === 'pending') ||
        (typeof tokenVerified !== 'string' &&
          tokenVerified.status === 'approved')
      ) {
        response.status(200).json({
          firstname: tokenVerified.firstName,
          email: tokenVerified.email,
          role: tokenVerified.role,
          status: tokenVerified.status,
        });
      }
    } catch (error) {
      if (
        error instanceof JsonWebTokenError &&
        error.message === 'jwt must be provided'
      ) {
        return response.status(401).json({
          message: 'Informe um token',
        });
      }

      if (
        error instanceof JsonWebTokenError &&
        error.message === 'invalid token'
      ) {
        return response.status(401).json({
          message: 'Informe um token válido',
        });
      }

      if (
        error instanceof JsonWebTokenError &&
        error.message === 'jwt malformed'
      ) {
        return response.status(401).json({
          message: 'Informe um token válido',
        });
      }

      if (error instanceof TokenExpiredError) {
        return response.status(401).json({
          message: 'Token expirado',
        });
      }
    }
  },
);

app.post('/api/v1/logout', (request: Request, response: Response) => {
  return response
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 2 * 60 * 1000,
      sameSite: 'none',
    })
    .json({ message: 'Cookie deletado' });
});

app.listen(process.env.SERVER_PORT);
