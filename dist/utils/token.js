"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCreate = jwtCreate;
exports.jwtVerify = jwtVerify;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function jwtCreate(firstname, status, role, email, id) {
    const token = jsonwebtoken_1.default.sign({ firstName: firstname, status, role, email: email, id: id }, process.env.JSONWEBTOKEN_KEY, { expiresIn: '1d' });
    return token;
}
function jwtVerify(tokenIsValid) {
    const token = jsonwebtoken_1.default.verify(tokenIsValid, process.env.JSONWEBTOKEN_KEY);
    return token;
}
