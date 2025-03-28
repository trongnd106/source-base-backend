import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@/utils/logger';
import { accounts_customuser, PrismaClient } from '@prisma/client';
import { USER_ACTIVE_STATUS } from '@/utils/enums';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

const checkUserRole = (req: RequestWithUser, next: NextFunction, findUser: accounts_customuser) => {
  const reqPath = req.path;
  if (reqPath.includes('admin') && (findUser.is_staff || findUser.is_superuser)) {
    return true;
  } else if (!reqPath.includes('admin')) {
    return true;
  } else {
    return false;
  }
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    logger.debug(req.path);
    const prisma = new PrismaClient();
    const Authorization = getAuthorization(req);
    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const findUser: accounts_customuser = await prisma.accounts_customuser.findFirst({
        where: {
          id,
          is_active: USER_ACTIVE_STATUS.ACTIVE,
        },
      });
      logger.debug(`Find User: ${findUser.username} - ${findUser.email} - ${findUser.is_superuser ? 'Admin' : 'Seller'}`);

      if (checkUserRole(req, next, findUser)) {
        req.user = findUser;
        next();
      } else {
        logger.debug('Not found user');
        next(new HttpException(404, 'Not found'));
      }
    } else {
      logger.debug('Unauthorized');
      next(new HttpException(401, 'Unauthorized'));
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
