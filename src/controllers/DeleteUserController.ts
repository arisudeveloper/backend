import { Request, Response } from 'express';
import { deleteAccountSchema } from '../schemas/user';
import { deleteUserDBEmail } from '../database/user';
import { jwtVerify } from '../utils/token';
import { ZodError } from 'zod';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export default class DeleteUserController {
  async handle(request: Request, response: Response) {
    try {
      const accountToDelete = deleteAccountSchema.parse(request.body);
      const token = request.cookies.token;
      const tokenVerified = jwtVerify(token);

      if (
        typeof tokenVerified === 'object' &&
        accountToDelete.email === tokenVerified.email
      ) {
        await deleteUserDBEmail(accountToDelete.email);
        return response
          .status(200)
          .json({ message: `${accountToDelete.email} deletado` });
      }

      return response.status(401).json({ message: 'Email não correspondente' });
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Erro na validação dos dados enviados',
        });
      }

      if (error instanceof TokenExpiredError) {
        return response.status(400).json({
          message: 'Token expirou',
        });
      }

      if (error instanceof PrismaClientKnownRequestError) {
        return response.status(400).json({
          message: 'Conta já foi deletada',
        });
      }
    }
  }
}
