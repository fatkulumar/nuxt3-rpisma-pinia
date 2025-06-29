import { PrismaClient } from '~/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import { User } from '~/types/user';
import { validateInput } from '~/server/utils/validate';
const prisma = new PrismaClient().$extends(withAccelerate());

export const getAllUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const [data, total] = await Promise.all([
      prisma.users.findMany({
        where: {
          email: {
            contains: search,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.users.count({
        where: {
          email: {
            contains: search,
          },
        },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    const basePath = `/api/users`; // ganti jika perlu
    const buildLink = (p: number) => `${basePath}?page=${p}&limit=${limit}`;

    return {
      data,
      meta: {
        current_page: page,
        per_page: limit,
        total,
        last_page: lastPage,
        from,
        to,
      },
      links: {
        first: buildLink(1),
        last: buildLink(lastPage),
        next: page < lastPage ? buildLink(page + 1) : null,
        prev: page > 1 ? buildLink(page - 1) : null,
      },
    };
  } catch (error: any) {
    // Cek apakah error dari validasi H3
    const statusCode = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Terjadi kesalahan';
    const errors = error.data || null;

    return responseError(errors, statusMessage, false, statusCode );
  }
};

type CreateUserInput = Pick<User, 'name' | 'email' | 'password'>;

export const createUser = async (data: Partial<CreateUserInput>) => {
  try {
    const validate = await validateInput(data, {
      name: ['required', { min: 3 }],
      email: ['required', 'email', 'unique:users,email'],
      password: ['required'],
    });

    if (validate?.code == 422) {
      return responseError(validate.data, validate.message, validate.status, validate?.code)
    }

    const user = await prisma.users.create({
      data: {
        name: data.name!,
        email: data.email!,
        password: data.password!,
      },
    });

    return responseSuccess(user, "User Berhasil Dibuat", true, 200 );
  } catch (error: any) {
    // Cek apakah error dari validasi H3
    const statusCode = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Terjadi kesalahan';
    const errors = error.data || null;

    return responseError(errors, statusMessage, false, statusCode );
  }
};

export const updateUser = async (data: User) => {
  try {
    const validate = await validateInput(data, {
      id: ['required'],
      name: ['required', { min: 3 }],
      email: ['required', 'email'],
      password: ['required'],
    });

    if (validate?.code == 422) {
      return responseError(validate.data, validate.message, validate.status, validate?.code)
    }

    const user = await prisma.users.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name!,
        email: data.email!,
        password: data.password!,
      },
    });

    return responseSuccess(user, "User Berhasil Diupdate", true, 200 );
  } catch (error: any) {
    // Cek apakah error dari validasi H3
    const statusCode = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Terjadi kesalahan';
    const errors = error.data || null;

    return responseError(errors, statusMessage, false, statusCode );
  }
};

export const deleteUser = async (data: User) => {
  try {
    const validate = await validateInput(data, {
      id: ['required'],
      name: ['required', { min: 3 }],
      email: ['required', 'email'],
      password: ['required'],
    });

    if (validate?.code == 422) {
      return responseError(validate.data, validate.message, validate.status, validate?.code)
    }

    const user = await prisma.users.delete({
      where: {
        id: data.id,
      }
    });

    return responseSuccess(user, "User Berhasil Dihapus", true, 200 );
  } catch (error: any) {
    // Cek apakah error dari validasi H3
    const statusCode = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Terjadi kesalahan';
    const errors = error.data || null;

    return responseError(errors, statusMessage, false, statusCode );
  }
};