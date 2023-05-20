import logger from '@src/utils/logger';
import morgan, { StreamOptions } from 'morgan';
import config from './config';
import { Request, Response } from 'express';

morgan.token(
  'message',
  (req: Request, res: Response) => res.locals.errorMessage || '',
);

const getIpFormat = (): string =>
  config.env === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: <StreamOptions>{
    write: (message: string) => logger.info(message.trim()),
  },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: <StreamOptions>{
    write: (message: string) => logger.error(message.trim()),
  },
});

export { successHandler, errorHandler };