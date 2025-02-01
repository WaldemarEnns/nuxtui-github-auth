<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <TheNavigation :user="user!" />
  <div class="container">
    <slot />
  </div>
</template>