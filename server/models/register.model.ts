import { User } from "~/types/user";
import { validateInput } from "~/server/utils/validate";
import { PrismaClient } from "~/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient().$extends(withAccelerate());

type RegisterInput = Pick<User, 'email' | 'password' | 'name'>;

export const register = async (data: Partial<RegisterInput>) => {
  const validate = await validateInput(data, {
    name: ['required'],
    email: ['required', 'email'],
    password: ['required'],
  });

  if (validate?.code === 422) {
    return responseError(validate.data, validate.message, validate.status, validate.code);
  }

  try {
    const name = data.name!;
    const email = data.email!;
    const password = data.password!;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return responseSuccess(user, 'Berhasil menyimpan data', true, 201);
  } catch (err: any) {
    console.error('❌ Error saat register:', err.message);
    return responseError(null, 'Gagal menyimpan data', false, 500);
  }
};
