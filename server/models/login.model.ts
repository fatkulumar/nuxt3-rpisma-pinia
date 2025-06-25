import { PrismaClient, users } from "~/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { User } from "~/types/user";
import { validateInput } from "~/server/utils/validate";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient().$extends(withAccelerate());

type loginInput = Pick<User, 'email' | 'password'>;

export const login = async (data: Partial<loginInput>) => {
    try {
        const validate = await validateInput(data, {
            email: ['required', 'email'],
            password: ['required'],
        });

        if (validate?.code == 422) {
            return responseError(validate.data, validate.message, validate.status, validate.code);
        }

        const user = await prisma.users.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            return responseError(data.email, 'Email Tidak Ditemukan', false, 404);
        }

        const isValid = await bcrypt.compare(data.password!, user.password!);
        if (!isValid) {
            return responseError(null, 'Password Salah!', false, 404);
        }

        const { password: _, ...safeUser } = user;

        return responseSuccess(safeUser, "Login Successfully", true, 200);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        const statusMessage = error.statusMessage || 'Terjadi Kesalahan Pada Server';
        const errors = error.data || null;
        return responseError(errors, statusMessage, false, statusCode);
    }
};