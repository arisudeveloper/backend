"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const RegisterUserController_1 = __importDefault(require("./controllers/RegisterUserController"));
const LoginUserController_1 = __importDefault(require("./controllers/LoginUserController"));
const VerifyAdmin_1 = __importDefault(require("./middleware/VerifyAdmin"));
const AdminController_1 = __importDefault(require("./controllers/AdminController"));
const ForgotPasswordController_1 = __importDefault(require("./controllers/ForgotPasswordController"));
const ResetPasswordController_1 = __importDefault(require("./controllers/ResetPasswordController"));
const DeleteUserController_1 = __importDefault(require("./controllers/DeleteUserController"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const throttle_1 = require("./middleware/throttle");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const limiter_1 = require("./middleware/limiter");
const token_1 = require("./utils/token");
const jsonwebtoken_1 = require("jsonwebtoken");
const register = new RegisterUserController_1.default();
const login = new LoginUserController_1.default();
const verifyAdmin = new VerifyAdmin_1.default();
const adminController = new AdminController_1.default();
const forgotPasswordController = new ForgotPasswordController_1.default();
const resetPasswordController = new ResetPasswordController_1.default();
const deleteUserController = new DeleteUserController_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(rateLimiter_1.rateLimiter);
app.use(throttle_1.throttle);
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.post('/api/v1/register', limiter_1.limiter, register.handleRegister);
app.post('/api/v1/login', limiter_1.limiter, login.handleLogin);
app.post('/api/v1/admin', verifyAdmin.handle, adminController.handle);
app.patch('/api/v1/admin/user/:id', verifyAdmin.handle, adminController.updateUser);
app.post('/api/v1/forgot-password', limiter_1.limiter, forgotPasswordController.handleForgot);
app.patch('/api/v1/reset-password', limiter_1.limiter, resetPasswordController.handleResetPassword, resetPasswordController.updatePasswordHash);
app.delete('/api/v1/delete', limiter_1.limiter, deleteUserController.handle);
app.post('/api/v1/user', (request, response, next) => {
    const cookieToken = request.cookies.token;
    response.locals.cookie = cookieToken;
    next();
}, (request, response) => {
    try {
        const tokenVerified = (0, token_1.jwtVerify)(response.locals.cookie);
        if ((typeof tokenVerified !== 'string' &&
            tokenVerified.status === 'pending') ||
            (typeof tokenVerified !== 'string' &&
                tokenVerified.status === 'approved')) {
            response.status(200).json({
                firstname: tokenVerified.firstName,
                email: tokenVerified.email,
                role: tokenVerified.role,
                status: tokenVerified.status,
            });
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
});
app.post('/api/v1/logout', (request, response) => {
    return response.clearCookie('token').json({ message: 'Cookie deletado' });
});
app.listen(process.env.SERVER_PORT);
