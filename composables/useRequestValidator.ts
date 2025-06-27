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

  const {
    method = 'GET',
    platform: incomingPlatform,
    allowedPlatforms = ['app', 'browser', 'browser-dev'],
    query = {},
    body = {},
    headers = {}
  } = options

  // Tentukan platform secara dinamis
  const platform = incomingPlatform ?? (process.server ? 'app' : 'browser')

  // Validasi platform
  if (!allowedPlatforms.includes(platform)) {
    throw new Error(
      `Platform '${platform}' tidak diizinkan. Hanya: ${allowedPlatforms.join(', ')}`
    )
  }

  // Ambil headers server jika di SSR (misalnya cookie, auth, dsb)
  const serverHeaders = process.server ? useRequestHeaders(['cookie', 'authorization']) : {}

  // Siapkan konfigurasi fetch
  const fetchOptions: any = {
    method,
    query,
    headers: {
      'client-platform': platform,
      ...serverHeaders,
      ...headers
    }
  }

  // Tambahkan body jika bukan GET/HEAD
  const safeMethod = method.toUpperCase()
  if (safeMethod !== 'GET' && safeMethod !== 'HEAD' && Object.keys(body).length > 0) {
    fetchOptions.body = body
  }

  // Debug log
  // console.log('📡 Fetch URL:', url)
  // console.log('📦 Fetch Options:', fetchOptions)

  // Jalankan request
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
