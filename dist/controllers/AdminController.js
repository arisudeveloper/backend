"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../database/user");
const client_1 = require("@prisma/client");
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
class AdminController {
    async handle(request, response) {
        try {
            const users = await (0, user_1.findUsersPending)();
            return response.status(200).send({ message: users });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientValidationError) {
                return response
                    .status(400)
                    .send({ message: 'Valor informado inválido' });
            }
        }
    }
    async updateUser(request, response) {
        try {
            const mailgun = new mailgun_js_1.default(form_data_1.default);
            const mg = mailgun.client({
                username: 'api',
                key: `${process.env.API_MAILGUN_KEY}`,
            });
            const req = request.params.id;
            const user = await (0, user_1.findUserDB)(req);
            await (0, user_1.updateUserDB)(req);
            const data = await mg.messages.create(`${process.env.API_MAILGUN_DOMAIN}`, {
                from: `Brazil Sensations ${process.env.API_MAILGUN_POSTMASTER}`,
                to: [`${user === null || user === void 0 ? void 0 : user.username} <${user === null || user === void 0 ? void 0 : user.email}>`],
                subject: `${user === null || user === void 0 ? void 0 : user.username}, Registration approved.`,
                html: '<h1>Log in with your email and password to access Brazil Sensations’ exclusive content. / Inscription approuvée. Connectez-vous avec votre e-mail et votre mot de passe pour accéder au contenu exclusif de Brazil Sensations. / Registro aprobado. Inicia sesión con tu correo electrónico y contraseña para acceder al contenido exclusivo de Brazil Sensations. / Rejestracja zatwierdzona. Zaloguj się za pomocą adresu e-mail i hasła, aby uzyskać dostęp do ekskluzywnych treści Brazil Sensations. </h1>',
            });
            return response.status(200).send({ message: 'Usuário aprovado' });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                return response.status(400).send({ message: 'Usuário não encontrado' });
            }
        }
    }
}
exports.default = AdminController;
