import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from '../utils/token';
import { Status } from '../enums/status';
import { resetPasswordSchema } from '../schemas/user';
import { hash } from '../utils/hash';
import { updateUserDBPassword } from '../database/user';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';

export default class ResetPasswordController {
  async handleResetPassword(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      let token = request.headers.authorization;
      if (token?.startsWith('Bearer ')) {
        token = token.slice(7);
      }
      const tokenVerified = jwtVerify(token!);
      if (
        typeof tokenVerified !== 'string' &&
        tokenVerified.status === Status.approved
      ) {
        response.locals.user = tokenVerified;
        next();
      } else {
        return response.status(401).send({ message: 'Usuário não autorizado' });
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return response.status(400).json({
          message: 'Token inválido',
        });
      }
    }
  }

  async updatePasswordHash(request: Request, response: Response) {
    try {
      const user = resetPasswordSchema.parse(request.body);
      const newhash = hash(user.newpassword);
      await updateUserDBPassword(response.locals.user.email, newhash);
      return response.status(200).send({ message: 'Senha alterada' });
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Erro na validação dos dados enviados',
        });
      }
    }
  }
}
