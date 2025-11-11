"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../database/user");
const user_2 = require("../schemas/user");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class RegisterUserController {
    async handleRegister(request, response) {
        try {
            const body = user_2.createUserRegisterSchema.parse(request.body);
            await (0, user_1.insertUser)(body);
            return response
                .status(201)
                .json({ message: 'Usuario registrado com sucesso.' });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return response.status(400).json({
                    message: 'Erro na validação dos dados enviados',
                });
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return response.status(409).json({ message: 'Email já existe' });
                }
            }
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
exports.default = RegisterUserController;
