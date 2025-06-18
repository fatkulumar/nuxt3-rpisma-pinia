import type { ResponseSingle, ResponseArray } from '~/types/response';
export function responseSuccess<T>(data: T | T[], message = 'Success', status = true, code = 200): ResponseArray<T> {
  return {
    code,
    status,
    message,
    data,
  };
}
export function responseError<T>(data: any | any[], message = 'Error', status = false, code = 400): ResponseArray<any> {
  return {
    code,
    status,
    message,
    data,
  };
}