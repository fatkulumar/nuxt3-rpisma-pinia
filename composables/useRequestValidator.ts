export async function useClientFetchWithValidation<T>(
  url: string,
  {
    method = 'GET',
    platform = 'app',
    allowedPlatforms = ['app'],
    query = {},
    body = {},
    headers = {},
  }: {
    method?: string;
    platform?: string;
    allowedPlatforms?: string[];
    query?: Record<string, any>;
    body?: Record<string, any>;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  if (process.server) {
    throw new Error('useClientFetchWithValidation hanya bisa dipakai di client.');
  }

  if (!allowedPlatforms.includes(platform)) {
    throw new Error(`Platform '${platform}' tidak diizinkan. Hanya: ${allowedPlatforms.join(', ')}`);
  }

  const options: any = {
    method,
    query,
    headers: {
      'client-platform': platform,
      ...headers,
    },
  };

  // ⛔ Hanya sertakan body kalau bukan GET/HEAD
  if (method !== 'GET' && method !== 'HEAD') {
    options.body = body;
  }

  try {
    return await $fetch<T>(url, options);
  } catch (error: any) {
    const msg =
      error?.data?.message || error.statusMessage || error.message || 'Terjadi kesalahan saat mengambil data';
    throw new Error(msg);
  }
}
