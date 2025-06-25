export async function requestValidation<T>(
  url: string,
  options: {
    method?: string
    platform?: 'app' | 'browser' | 'browser-dev'
    allowedPlatforms?: string[]
    query?: Record<string, any>
    body?: Record<string, any>
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  console.log('🧭 RequestValidation berjalan di:', process.server ? 'SERVER' : 'CLIENT')
  // if (process.server) {
  //   throw new Error('requestValidation hanya boleh dipakai di sisi client.')
  // }

  const {
    method = 'GET',
    platform = 'app',
    allowedPlatforms = ['app'],
    query = {},
    body = {},
    headers = {}
  } = options

  // Validasi platform
  if (!allowedPlatforms.includes(platform)) {
    throw new Error(
      `Platform '${platform}' tidak diizinkan. Hanya: ${allowedPlatforms.join(', ')}`
    )
  }

  // Siapkan konfigurasi fetch
  const fetchOptions: any = {
    method,
    query,
    headers: {
      'client-platform': platform,
      ...headers
    }
  }

  // Tambahkan body jika bukan GET/HEAD
  const safeMethod = method.toUpperCase()
  if (safeMethod !== 'GET' && safeMethod !== 'HEAD' && Object.keys(body).length > 0) {
    fetchOptions.body = body
  }
  console.log(url, fetchOptions)
  try {
    return await $fetch<T>(url, fetchOptions)
  } catch (error: any) {
    const msg =
      error?.data?.message ||
      error?.statusMessage ||
      error?.message ||
      'Terjadi kesalahan saat mengambil data'
    throw new Error(msg)
  }
}
