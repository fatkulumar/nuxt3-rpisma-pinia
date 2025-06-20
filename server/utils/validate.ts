import { PrismaClient } from '~/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createError } from 'h3';

const prisma = new PrismaClient().$extends(withAccelerate());

type Rule =
  | 'required'
  | 'email'
  | `unique:${string},${string}` // ex: unique:users,email
  | { min?: number; max?: number }
  | ((val: any) => string | null);

type ValidationSchema<T> = Record<keyof T, Rule[]>;

export async function validateInput<T>(
  data: Partial<T>,
  rules: ValidationSchema<T>
) {
  const errors: Record<string, string> = {};
  const asyncValidations: Promise<void>[] = [];

  for (const field in rules) {
    const fieldRules = rules[field];
    const value = data[field as keyof T];

    for (const rule of fieldRules) {
      // === Required
      if (rule === 'required') {
        if (value === undefined || value === null || value === '') {
          errors[field] = `${field} wajib diisi.`;
          break;
        }
      }

      // === Email format
      if (rule === 'email' && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = `${field} harus berupa email yang valid.`;
          break;
        }
      }

      // === Unique:<model>,<field>
      if (typeof rule === 'string' && rule.startsWith('unique:')) {
        const [, modelName, columnName] = rule.match(/^unique:(.+),(.+)$/) || [];

        if (!modelName || !columnName) {
          throw createError({
            statusCode: 500,
            statusMessage: `Format rule unique tidak valid pada "${rule}"`,
          });
        }

        asyncValidations.push(
          (async () => {
            // validasi bahwa prisma[modelName] ada
            const model = (prisma as any)[modelName];
            if (!model || typeof model.findUnique !== 'function') {
              throw createError({
                statusCode: 500,
                statusMessage: `Model "${modelName}" tidak ditemukan di Prisma.`,
              });
            }

            const whereClause = { [columnName]: value };
            const exists = await model.findUnique({ where: whereClause });

            if (exists) {
              errors[field] = `${field} sudah digunakan.`;
            }
          })()
        );
      }

      // === Min/Max
      if (typeof rule === 'object') {
        if ('min' in rule && typeof value === 'string' && value.length < rule.min!) {
          errors[field] = `${field} minimal ${rule.min} karakter.`;
          break;
        }
        if ('max' in rule && typeof value === 'string' && value.length > rule.max!) {
          errors[field] = `${field} maksimal ${rule.max} karakter.`;
          break;
        }
      }

      // === Custom function
      if (typeof rule === 'function') {
        const msg = rule(value);
        if (msg) {
          errors[field] = msg;
          break;
        }
      }
    }
  }

  // Tunggu semua validasi async (e.g. unique)
  await Promise.all(asyncValidations);
  // Jika ada error, lempar sebagai error H3
  if (Object.keys(errors).length > 0) {
    return responseError(errors, `Validasi gagal.`, false, 422)
    // throw createError({
    //   statusCode: 422,
    //   statusMessage: 'Validasi gagal',
    //   data: errors,
    // });
  }
}
