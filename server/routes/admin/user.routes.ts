import { createRouter, defineEventHandler } from "h3";
import { getUsers, createUser, updateUser, deleteUser } from "../../controllers/admin/user.controller";
const router = createRouter();
router.get('/', defineEventHandler(async (event) => {
    return await getUsers(event);
}));
router.post('/', defineEventHandler(async (event) => {
    return await createUser(event);
}));
router.put('/', defineEventHandler(async (event) => {
    return await updateUser(event);
}));
router.delete('/', defineEventHandler(async (event) => {
    return await deleteUser(event);
}));
export default useBase("/api/admin/user", router.handler);
