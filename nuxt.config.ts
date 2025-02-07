/// <reference types="vitest" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ignore: ['**/*.spec.ts'],
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxt/test-utils/module'
  ]
})