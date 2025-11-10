export type User = {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  company?: string;
  country: string;
  phone?: string;
  whatsapp?: string;
  mice: boolean;
  fit: boolean;
  groups: boolean;
  guaranteed: boolean;
  leisure: boolean;
  policy: boolean;
};

export type UserLogin = {
  email: string;
  password: string;
};
