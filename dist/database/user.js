"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUser = insertUser;
exports.loginUser = loginUser;
exports.findUsersPending = findUsersPending;
exports.updateUserDB = updateUserDB;
exports.updateUserDBPassword = updateUserDBPassword;
exports.findUserDB = findUserDB;
exports.findUserDBEmail = findUserDBEmail;
exports.deleteUserDBEmail = deleteUserDBEmail;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/hash");
const token_1 = require("../utils/token");
const status_1 = require("../enums/status");
const prisma = new client_1.PrismaClient();
prisma.$connect();
async function insertUser(user) {
    const hashPassword = (0, hash_1.hash)(user.password);
    await prisma.user.create({
        data: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            password: hashPassword,
            company: user.company,
            country: user.country,
            phone: user.phone,
            whatsapp: user.whatsapp,
            mice: user.mice,
            fit: user.fit,
            groups: user.groups,
            guaranteed: user.guaranteed,
            leisure: user.leisure,
        },
    });
    return true;
}
async function loginUser(credentials) {
    const userRecord = await prisma.user.findUnique({
        where: {
            email: credentials.email,
        },
    });
    if (!userRecord) {
        throw new Error('Usuario não encontrado');
    }
    const isValidPassword = await (0, hash_1.compareHash)(credentials.password, userRecord.password);
    const authToken = (0, token_1.jwtCreate)(userRecord.firstname, userRecord.status, userRecord.role, userRecord.email, userRecord.id);
    return {
        isValidPassword,
        user: userRecord,
        token: authToken,
    };
}
async function findUsersPending() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            username: true,
            company: true,
            country: true,
            phone: true,
            whatsapp: true,
            mice: true,
            fit: true,
            groups: true,
            guaranteed: true,
            leisure: true,
            status: true,
        },
    });
    return users;
}
async function updateUserDB(uuid) {
    await prisma.user.update({
        where: {
            id: uuid,
        },
        data: {
            status: status_1.Status.approved,
        },
    });
}
async function updateUserDBPassword(email, newPasswordHash) {
    await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: newPasswordHash,
        },
    });
}
async function findUserDB(uuid) {
    const user = await prisma.user.findUnique({
        where: {
            id: uuid,
        },
        select: {
            username: true,
            email: true,
        },
    });
    return user;
}
async function findUserDBEmail(email) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            firstname: true,
            status: true,
            role: true,
            email: true,
            id: true,
        },
    });
    return user;
}
async function deleteUserDBEmail(email) {
    const user = await prisma.user.delete({
        where: {
            email: email,
        },
    });
    return user;
}
