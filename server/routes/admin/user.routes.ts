import { createRouter, defineEventHandler } from "h3";
import { getUsers } from "../../controllers/admin/user.controller";
const router = createRouter();
router.get('/', defineEventHandler(getUsers));
export default useBase("/api/admin/user", router.handler);
