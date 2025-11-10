import { Request, Response } from 'express';
import { forgotPasswordSchema } from '../schemas/user';
import { findUserDBEmail } from '../database/user';
import { jwtCreate } from '../utils/token';
import Mailgun from 'mailgun.js';
import { ZodError } from 'zod';

export default class ForgotPasswordController {
  async handleForgot(request: Request, response: Response) {
    try {
      const userRequest = forgotPasswordSchema.parse(request.body);

      const userDB = await findUserDBEmail(userRequest.email);


      if (userDB) {
        const token = jwtCreate(
          userDB.firstname,
          userDB.status,
          userDB.role,
          userDB.email,
          userDB.id,
        );

        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
          username: 'api',
          key: `${process.env.API_MAILGUN_KEY}`,
        });

        await mg.messages.create(`${process.env.API_MAILGUN_DOMAIN}`, {
          from: `Reset your password ${process.env.API_MAILGUN_POSTMASTER}`,
          to: [`${userDB?.firstname} <${userDB?.email}>`],
          subject: `${userDB?.firstname}, `,
          html: `<h1>Use the link below to reset your password. / Utilisez le lien ci-dessous pour réinitialiser votre mot de passe. / Utiliza el enlace de abajo para restablecer tu contraseña. / Use o link abaixo para redefinir sua senha. / Użyj poniższego linku, aby zresetować swoje hasło.</h1> <a href="http://localhost:5173/reset-pass/${token}">Redefinir senha</a>`,
        });
        return response.status(200).json({
          message: 'Link para redefinição enviado com sucesso para o e-mail',
        });
      } else {
        return response.status(404).json({ message: 'E-mail inválido' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: 'Erro na validação dos dados enviados',
        });
      }
    }
  }
}
