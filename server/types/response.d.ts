export interface ResponseSingle<T> {
  code: number;
  status: boolean;
  message: string;
  data: T | null;
}

export interface ResponseArray<T> {
  code: number;
  status: boolean;
  message: string;
  data: T | T[];
}