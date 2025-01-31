<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: 'auth',
})
</script>

<template>
  <UContainer>
    <UCard class="mt-24 mx-auto">
      <template #header>
        <h1 class="text-center text-lg font-semibold">Welcome! Please login to continue.</h1>
      </template>

      <div class="flex flex-col justify-center items-center">
        <p>Currently we provide a login via GitHub:</p>

        <UButton
          class="mt-8"
          icon="i-grommet-icons:github"
          size="xl"
          color="primary"
          variant="outline"
          label="Login with GitHub"
          :trailing="false"
          to="/auth/github"
          external
        />
      </div>

      <template #footer>
        <small>Secure login via GitHub.</small>
      </template>
    </UCard>
  </UContainer>
</template>