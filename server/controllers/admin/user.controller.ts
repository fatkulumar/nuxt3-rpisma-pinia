import { H3Event } from 'h3';
import * as UserModel from '~/server/models/user.model';
import { responseSuccess } from '~/server/utils/response.util';

export const getUsers = async (event: H3Event) => {
  const platform = event.context.platform; // ← dari middleware global
  console.log('Platform:', platform);      // opsional

  const users = await UserModel.getAllUsers();
  return responseSuccess(users, "Berhasil Mendapatkan Data", true, 200 );
};
