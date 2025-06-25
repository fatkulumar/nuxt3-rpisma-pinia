import { createRouter, defineEventHandler } from "h3";
import { login } from "~/server/controllers/login.controller";
const router = createRouter();
router.post('/', defineEventHandler(async (event) => {
    return await login(event);
}));
export default useBase("/api/login", router.handler);