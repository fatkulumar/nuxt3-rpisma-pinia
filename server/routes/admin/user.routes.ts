import { createApp, defineEventHandler } from 'h3';
import * as UserController from '../../controllers/admin/user.controller';
const router = createApp();
router.use('/', defineEventHandler(UserController.getUsers));
export default router;
