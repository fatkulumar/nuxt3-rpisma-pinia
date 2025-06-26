import { createRouter, defineEventHandler } from 'h3';
import { register } from '../controllers/register.controller';
const router = createRouter();
router.post('/', defineEventHandler(async (event) => {
    return await register(event);
}));
export default useBase('/api/register', router.handler);