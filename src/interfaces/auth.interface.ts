import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  access_token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
