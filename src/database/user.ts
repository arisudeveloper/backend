import { PrismaClient } from '@prisma/client';
import { User, UserLogin } from '../types/user';
import { compareHash, hash } from '../utils/hash';
import { jwtCreate } from '../utils/token';
import { Status } from '../enums/status';
const prisma = new PrismaClient();
prisma.$connect();

export async function insertUser(user: User) {
  const hashPassword = hash(user.password);

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

export async function loginUser(credentials: UserLogin) {
  const userRecord = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  });
  if (!userRecord) {
    throw new Error('Usuario não encontrado');
  }
  const isValidPassword = await compareHash(
    credentials.password,
    userRecord.password,
  );
  const authToken = jwtCreate(
    userRecord.firstname,
    userRecord.status,
    userRecord.role,
    userRecord.email,
    userRecord.id,
  );
  return {
    isValidPassword,
    user: userRecord,
    token: authToken,
  };
}

export async function findUsersPending() {
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

export async function updateUserDB(uuid: string) {
  await prisma.user.update({
    where: {
      id: uuid,
    },
    data: {
      status: Status.approved,
    },
  });
}

export async function updateUserDBPassword(
  email: string,
  newPasswordHash: string,
) {
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: newPasswordHash,
    },
  });
}

export async function findUserDB(uuid: string) {
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

export async function findUserDBEmail(email: string) {
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

export async function deleteUserDBEmail(email: string) {
  const user = await prisma.user.delete({
    where: {
      email: email,
    },
  });
  return user;
}
