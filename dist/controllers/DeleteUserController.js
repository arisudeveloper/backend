"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../schemas/user");
const user_2 = require("../database/user");
const token_1 = require("../utils/token");
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const library_1 = require("@prisma/client/runtime/library");
class DeleteUserController {
    async handle(request, response) {
        try {
            const accountToDelete = user_1.deleteAccountSchema.parse(request.body);
            const token = request.cookies.token;
            const tokenVerified = (0, token_1.jwtVerify)(token);
            if (typeof tokenVerified === 'object' &&
                accountToDelete.email === tokenVerified.email) {
                await (0, user_2.deleteUserDBEmail)(accountToDelete.email);
                return response
                    .status(200)
                    .json({ message: `${accountToDelete.email} deletado` });
            }
            return response.status(401).json({ message: 'Email não correspondente' });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return response.status(400).json({
                    message: 'Erro na validação dos dados enviados',
                });
            }
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return response.status(400).json({
                    message: 'Token expirou',
                });
            }
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                return response.status(400).json({
                    message: 'Conta já foi deletada',
                });
            }
        }
    }
}
exports.default = DeleteUserController;
