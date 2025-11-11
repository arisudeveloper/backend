"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../schemas/user");
const user_2 = require("../database/user");
const token_1 = require("../utils/token");
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const zod_1 = require("zod");
class ForgotPasswordController {
    async handleForgot(request, response) {
        try {
            const userRequest = user_1.forgotPasswordSchema.parse(request.body);
            const userDB = await (0, user_2.findUserDBEmail)(userRequest.email);
            if (userDB) {
                const token = (0, token_1.jwtCreate)(userDB.firstname, userDB.status, userDB.role, userDB.email, userDB.id);
                const mailgun = new mailgun_js_1.default(FormData);
                const mg = mailgun.client({
                    username: 'api',
                    key: `${process.env.API_MAILGUN_KEY}`,
                });
                await mg.messages.create(`${process.env.API_MAILGUN_DOMAIN}`, {
                    from: `Reset your password ${process.env.API_MAILGUN_POSTMASTER}`,
                    to: [`${userDB === null || userDB === void 0 ? void 0 : userDB.firstname} <${userDB === null || userDB === void 0 ? void 0 : userDB.email}>`],
                    subject: `${userDB === null || userDB === void 0 ? void 0 : userDB.firstname}, `,
                    html: `<h1>Use the link below to reset your password. / Utilisez le lien ci-dessous pour réinitialiser votre mot de passe. / Utiliza el enlace de abajo para restablecer tu contraseña. / Use o link abaixo para redefinir sua senha. / Użyj poniższego linku, aby zresetować swoje hasło.</h1> <a href="http://localhost:5173/reset-pass/${token}">Redefinir senha</a>`,
                });
                return response.status(200).json({
                    message: 'Link para redefinição enviado com sucesso para o e-mail',
                });
            }
            else {
                return response.status(404).json({ message: 'E-mail inválido' });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return response.status(400).json({
                    message: 'Erro na validação dos dados enviados',
                });
            }
        }
    }
}
exports.default = ForgotPasswordController;
