export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export interface Pagination<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}