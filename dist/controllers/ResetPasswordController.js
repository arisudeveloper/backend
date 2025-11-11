"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../utils/token");
const status_1 = require("../enums/status");
const user_1 = require("../schemas/user");
const hash_1 = require("../utils/hash");
const user_2 = require("../database/user");
const jsonwebtoken_1 = require("jsonwebtoken");
const zod_1 = require("zod");
class ResetPasswordController {
    async handleResetPassword(request, response, next) {
        try {
            let token = request.headers.authorization;
            if (token === null || token === void 0 ? void 0 : token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            const tokenVerified = (0, token_1.jwtVerify)(token);
            if (typeof tokenVerified !== 'string' &&
                tokenVerified.status === status_1.Status.approved) {
                response.locals.user = tokenVerified;
                next();
            }
            else {
                return response.status(401).send({ message: 'Usuário não autorizado' });
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                return response.status(400).json({
                    message: 'Token inválido',
                });
            }
        }
    }
    async updatePasswordHash(request, response) {
        try {
            const user = user_1.resetPasswordSchema.parse(request.body);
            const newhash = (0, hash_1.hash)(user.newpassword);
            await (0, user_2.updateUserDBPassword)(response.locals.user.email, newhash);
            return response.status(200).send({ message: 'Senha alterada' });
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
exports.default = ResetPasswordController;
