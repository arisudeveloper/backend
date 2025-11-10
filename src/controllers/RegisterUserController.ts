import { Request, Response } from 'express';
import { User } from '../types/user';
import { insertUser } from '../database/user';
import { createUserRegisterSchema } from '../schemas/user';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export default class RegisterUserController {
  async handleRegister(request: Request, response: Response) {
    try {
      const body: User = createUserRegisterSchema.parse(request.body);

      await insertUser(body);

      return response
        .status(201)
        .json({ message: 'Usuario registrado com sucesso.' });
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Erro na validação dos dados enviados',
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return response.status(409).json({ message: 'Email já existe' });
        }
      }

      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}
