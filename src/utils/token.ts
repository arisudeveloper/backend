import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function jwtCreate(
  firstname: string,
  status: string,
  role: string,
  email: string,
  id: string,
) {
  const token = jwt.sign(
    { firstName: firstname, status, role, email: email, id: id },
    process.env.JSONWEBTOKEN_KEY!,
    { expiresIn: '2m' },
  );
  return token;
}

export function jwtVerify(tokenIsValid: string) {
  const token = jwt.verify(tokenIsValid, process.env.JSONWEBTOKEN_KEY!);
  return token;
}
