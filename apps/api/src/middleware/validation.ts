import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type ValidationSource = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema<any>, source: ValidationSource = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      );
      return next(new AppError(messages.join('. '), 400));
    }

    req[source] = result.data;
    next();
  };
