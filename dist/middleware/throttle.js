"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
const express_slow_down_1 = __importDefault(require("express-slow-down"));
exports.throttle = (0, express_slow_down_1.default)({
    windowMs: 60 * 1000,
    delayAfter: 400,
    delayMs: () => 500,
});
