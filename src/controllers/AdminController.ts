import { Request, Response } from 'express';
import { findUserDB, findUsersPending, updateUserDB } from '../database/user';
import { Prisma } from '@prisma/client';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export default class AdminController {
  async handle(request: Request, response: Response) {
    try {
      const users = await findUsersPending();
      return response.status(200).send({ message: users });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        return response
          .status(400)
          .send({ message: 'Valor informado inválido' });
      }
    }
  }

  async updateUser(request: Request, response: Response) {
    try {
      const mailgun = new Mailgun(FormData);
      const mg = mailgun.client({
        username: 'api',
        key: `${process.env.API_MAILGUN_KEY}`,
      });
      const req = request.params.id;
      const user = await findUserDB(req);

      await updateUserDB(req);
      const data = await mg.messages.create(
        `${process.env.API_MAILGUN_DOMAIN}`,
        {
          from: `Brazil Sensations ${process.env.API_MAILGUN_POSTMASTER}`,
          to: [`${user?.username} <${user?.email}>`],
          subject: `${user?.username}, Registration approved.`,
          html: '<h1>Log in with your email and password to access Brazil Sensations’ exclusive content. / Inscription approuvée. Connectez-vous avec votre e-mail et votre mot de passe pour accéder au contenu exclusif de Brazil Sensations. / Registro aprobado. Inicia sesión con tu correo electrónico y contraseña para acceder al contenido exclusivo de Brazil Sensations. / Rejestracja zatwierdzona. Zaloguj się za pomocą adresu e-mail i hasła, aby uzyskać dostęp do ekskluzywnych treści Brazil Sensations. </h1>',
        },
      );

      return response.status(200).send({ message: 'Usuário aprovado' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return response.status(400).send({ message: 'Usuário não encontrado' });
      }
    }
  }
}
