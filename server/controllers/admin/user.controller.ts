import { H3Event } from 'h3';
import * as UserModel from '~/server/models/admin/user.model';
import { responseSuccess } from '~/server/utils/response.util';

export const getUsers = async (event: H3Event) => {
  const query = getQuery(event);
  const page = parseInt((query.page as string) || '1', 10);
  const limit = parseInt((query.limit as string) || '10', 10);
  const search = query.search as string;

  const users = await UserModel.getAllUsers(page, limit, search);
  return responseSuccess(users, "Berhasil Mendapatkan Data", true, 200 );
};

export const createUser = async (event: H3Event) => {
  const body = await readBody(event);
  const users = await UserModel.createUser(body);
  if(users.code != 200) {
    return responseError(users.data, users.message, users.status, users.code);
  }else{
    return responseSuccess(users.data, users.message, users.status, users.code);
  }
};

export const updateUser = async (event: H3Event) => {
  const body = await readBody(event);
  const users = await UserModel.updateUser(body);
  if(users.code != 200) {
    return responseError(users.data, users.message, users.status, users.code );
  }else{
    return responseSuccess(users.data, users.message, users.status, users.code);
  }
};

export const deleteUser = async (event: H3Event) => {
  const body = await readBody(event);
  const users = await UserModel.deleteUser(body);
  if(users.code != 200) {
    return responseError(users.data, users.message, users.status, users.code );
  }else{
    return responseSuccess(users, "Berhasil Menghapus Data", true, 200 );
  }
};
