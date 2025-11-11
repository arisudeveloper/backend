"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../utils/token");
const jsonwebtoken_1 = require("jsonwebtoken");
const role_1 = require("../enums/role");
const status_1 = require("../enums/status");
class VerifyAdmin {
    handle(request, response, next) {
        try {
            let token = request.cookies.token;
            const tokenVerified = (0, token_1.jwtVerify)(token);
            if (typeof tokenVerified !== 'string' &&
                tokenVerified.status === status_1.Status.approved &&
                tokenVerified.role === role_1.Role.admin) {
                next();
            }
            else {
                return response.status(403).send({ message: 'Usuário não autorizado' });
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.JsonWebTokenError &&
                error.message === 'jwt must be provided') {
                return response.status(401).json({
                    message: 'Informe um token',
                });
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError &&
                error.message === 'invalid token') {
                return response.status(401).json({
                    message: 'Informe um token válido',
                });
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError &&
                error.message === 'jwt malformed') {
                return response.status(401).json({
                    message: 'Informe um token válido',
                });
            }
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return response.status(401).json({
                    message: 'Token expirado',
                });
            }
        }
    }
}
exports.default = VerifyAdmin;
