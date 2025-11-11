"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.compareHash = compareHash;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hash(password) {
    const hashPassword = bcrypt_1.default.hashSync(password, 10);
    return hashPassword;
}
async function compareHash(password, hash) {
    const hashCompare = await bcrypt_1.default.compare(password, hash);
    return hashCompare;
}
