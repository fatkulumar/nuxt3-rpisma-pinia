import { H3Event, getQuery } from 'h3';

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface PaginationLinks {
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export function getPagination(event: H3Event): { page: number; limit: number } {
  const query = getQuery(event);
  const page = parseInt((query.page as string) || '1');
  const limit = parseInt((query.limit as string) || '10');
  return { page, limit };
}

export function makePaginationMeta(
  event: H3Event,
  total: number,
  page: number,
  limit: number
): { meta: PaginationMeta; links: PaginationLinks } {
  const lastPage = Math.ceil(total / limit);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pathname = event.path || '/';
  const buildLink = (p: number) => `${pathname}?page=${p}&limit=${limit}`;

  return {
    meta: {
      current_page: page,
      per_page: limit,
      total,
      last_page: lastPage,
      from,
      to
    },
    links: {
      first: buildLink(1),
      last: buildLink(lastPage),
      next: page < lastPage ? buildLink(page + 1) : null,
      prev: page > 1 ? buildLink(page - 1) : null
    }
  };
}
