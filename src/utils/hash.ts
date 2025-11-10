import bcrypt from 'bcrypt';

export function hash(password: string) {
  const hashPassword = bcrypt.hashSync(password, 10);

  return hashPassword;
}

export async function compareHash(password: string, hash: string) {
  const hashCompare = await bcrypt.compare(password, hash);
  return hashCompare;
}
