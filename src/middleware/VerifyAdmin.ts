import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from '../utils/token';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Role } from '../enums/role';
import { Status } from '../enums/status';

export default class VerifyAdmin {
  handle(request: Request, response: Response, next: NextFunction) {
    try {
      let token = request.cookies.token;

      const tokenVerified = jwtVerify(token);
      if (
        typeof tokenVerified !== 'string' &&
        tokenVerified.status === Status.approved &&
        tokenVerified.role === Role.admin
      ) {
        next();
      } else {
        return response.status(403).send({ message: 'Usuário não autorizado' });
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
  }
}
