import { Request, Response, NextFunction } from 'express';
import { validateToken } from '@src/services/auth.service';
import { BadRequestError, AuthFailureError } from '@src/utils/apiError';

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<unknown, Record<string, unknown>> | void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new BadRequestError(`Token is missing`);
  }

  try {
    const decoded = validateToken(token);
    req.body.decoded = decoded;
    return next();
  } catch (err) {
    throw new AuthFailureError(`Unauthorized`);
  }
};

export default authMiddleware;