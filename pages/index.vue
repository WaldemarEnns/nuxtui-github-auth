<script setup lang="ts">
  const { clear } = useUserSession()
  const router = useRouter()

  function onLogout () {
    clear()
    router.push('/login')
  }
</script>

<template>
  <div>
    <h1 class="font-bold text-3xl underline">Hello World!</h1>
    <UButton
      class="mt-8"
      icon="i-grommet-icons:github"
      size="xl"
      color="primary"
      variant="outline"
      label="Logout"
      :trailing="false"
      @click="onLogout"
    ></UButton>
  </div>
</template>