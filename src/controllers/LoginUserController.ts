import { Request, Response } from 'express';
import { UserLogin } from '../types/user';
import { loginUser } from '../database/user';
import { createUserLoginSchema } from '../schemas/user';
import { ZodError } from 'zod';

export default class LoginUserController {
  async handleLogin(request: Request, response: Response) {
    try {
      const credentials: UserLogin = createUserLoginSchema.parse(request.body);

      const authResult = await loginUser(credentials);

      if (authResult.isValidPassword) {
        return response
          .status(200)
          .cookie('token', authResult.token, {
            httpOnly: true,
            secure: false,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,
          })
          .json({
            firstname: authResult.user.firstname,
            email: authResult.user.email,
            role: authResult.user.role,
            status: authResult.user.status,
          });
      } else {
        return response
          .status(401)
          .json({ message: 'Email ou senha inválida' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Erro na validação dos dados enviados',
        });
      }

      if (
        error instanceof Error &&
        error.message === 'Usuario não encontrado'
      ) {
        return response
          .status(401)
          .json({ message: 'Email ou senha invalida' });
      }
    }
  }
}
