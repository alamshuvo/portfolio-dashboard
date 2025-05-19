export interface IUser {
    userId: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    iat?: number;
    exp?: number;
  }
  