import { H3Event } from 'h3';
import * as registerModel from '~/server/models/register.model';
export const register = async (event: H3Event) => {
    const body = await readBody(event);
    const user = await registerModel.register(body);
    if (user.code != 200) {
        return responseError(user.data, user.message, user.status, user.code);
    } else {
        return responseSuccess(user.data, user.message, user.status, user.code);
    }
}