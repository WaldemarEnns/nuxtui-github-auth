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
    'nuxt-nodemailer',
  ],
  nodemailer: {
    from: process.env.NUXT_NODEMAILER_FROM,
    host: process.env.NUXT_NODEMAILER_HOST,
    port: process.env.NUXT_NODEMAILER_PORT,
    secure: true,
    auth: {
      user: process.env.NUXT_NODEMAILER_AUTH_USER,
      pass: process.env.NUXT_NODEMAILER_AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    }
  }
})