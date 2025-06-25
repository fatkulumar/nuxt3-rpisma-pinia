import { H3Event } from 'h3';
import * as LoginModel from '~/server/models/login.model';
import { responseSuccess } from '~/server/utils/response.util';

export const login = async (event: H3Event) => {
    const body = await readBody(event);
    const users = await LoginModel.login(body);
    if(users.code != 200) {
        return responseError(users.data, users.message, users.status, users.code);
    }else{
        return responseSuccess(users.data, users.message, users.status, users.code);
    }
};