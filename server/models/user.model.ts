import { PrismaClient } from '~/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
const prisma = new PrismaClient().$extends(withAccelerate());

export const getAllUsers = async (page = 1, limit = 10) => {
  const [data, total] = await Promise.all([
    prisma.users.findMany({
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.users.count(),
  ]);

  const lastPage = Math.ceil(total / limit);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const basePath = `/api/users`; // ganti sesuai route
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
};
