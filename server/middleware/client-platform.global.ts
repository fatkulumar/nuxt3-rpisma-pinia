import { defineEventHandler, createError } from 'h3'
import { responseError } from '~/server/utils/response.util'

export default defineEventHandler((event) => {
  const allowedPlatforms = ['app', 'browser', 'browser-dev']

  // Ambil header 'client-platform'
  let platform = event.node.req.headers['client-platform'] as string | undefined
  // console.log('lorem headers ' + event.node.req.headers['client-platform'])
  if (!platform) {
    // Jika tidak ada, fallback ke 'browser' + logging
    console.warn("Header 'client-platform' tidak ditemukan. Menggunakan fallback: 'browser'")
    platform = 'browser'
  }

  // Validasi platform
  if (!allowedPlatforms.includes(platform)) {
    // throw createError({
    //   statusCode: 400,
    //   statusMessage: `Header 'client-platform' harus salah satu dari: ${allowedPlatforms.join(', ')}`,
    // })
    return responseError(platform, `Platform '${platform}' tidak diizinkan.`, false, 400)
  }

  // Simpan ke context agar bisa diakses di controller
  event.context.platform = platform
})
