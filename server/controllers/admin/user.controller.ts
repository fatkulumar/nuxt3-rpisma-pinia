import { H3Event } from 'h3';
import * as UserModel from '~/server/models/user.model';
import { responseSuccess } from '~/server/utils/response.util';

export const getUsers = async (event: H3Event) => {
  const platform = event.context.platform; // ← dari middleware global
  console.log('Platform:', platform);      // opsional

  const query = getQuery(event);
  const page = parseInt((query.page as string) || '1', 10);
  const limit = parseInt((query.limit as string) || '10', 10);

  const users = await UserModel.getAllUsers(page, limit);
  return responseSuccess(users, "Berhasil Mendapatkan Data", true, 200 );
};
