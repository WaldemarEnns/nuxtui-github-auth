<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <TheNavigation :user="user!" />
  <UContainer class="mt-4">
    <slot />
  </UContainer>
</template>