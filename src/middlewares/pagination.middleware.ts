import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const pagination = {
      page: 1,
      limit: 10,
      offset: 0,
    };
    const page = req.query?.page as string;
    const limit = req.query?.limit as string;
    const p = parseInt(page);
    const l = parseInt(limit);
    if (typeof p == 'number' && typeof l == 'number' && p >= 1 && l >= 1) {
      pagination.page = p;
      pagination.limit = l;
      pagination.offset = l * (p - 1);
    }
    req['pagination'] = pagination;
    next();
  }
}

export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}
