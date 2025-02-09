/// <reference types="vitest" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ignore: ['**/*.spec.ts'],
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/test-utils/module',
    '@prisma/nuxt',
    ['nuxt-mail', {
      smtp: {
        host: process.env.MAIL_SMTP_HOST,
        port: process.env.MAIL_SMTP_PORT,
        auth: {
          user: process.env.MAIL_SMTP_USER,
          pass: process.env.MAIL_SMTP_PASSWORD,
        },
        secure: false,
      },
      message: {
        from: process.env.MAIL_FROM_ADDRESS,
        cc: process.env.MAIL_FROM_ADDRESS,
      }
    }],
  ],
})