"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../database/user");
const user_2 = require("../schemas/user");
const zod_1 = require("zod");
class LoginUserController {
    async handleLogin(request, response) {
        try {
            const credentials = user_2.createUserLoginSchema.parse(request.body);
            const authResult = await (0, user_1.loginUser)(credentials);
            if (authResult.isValidPassword) {
                return response
                    .status(200)
                    .cookie('token', authResult.token, {
                    httpOnly: true,
                    secure: true,
                    path: '/',
                    maxAge: 24 * 60 * 60 * 1000,
                })
                    .json({
                    firstname: authResult.user.firstname,
                    email: authResult.user.email,
                    role: authResult.user.role,
                    status: authResult.user.status,
                });
            }
            else {
                return response
                    .status(401)
                    .json({ message: 'Email ou senha inválida' });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return response.status(400).json({
                    message: 'Erro na validação dos dados enviados',
                });
            }
            if (error instanceof Error &&
                error.message === 'Usuario não encontrado') {
                return response
                    .status(401)
                    .json({ message: 'Email ou senha invalida' });
            }
        }
    }
}
exports.default = LoginUserController;
