import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}
