<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <UCard>
    <template #header>
      <h1>Profile</h1>
    </template>

    <UAvatar
      class="mb-4"
      :src="user.avatar_url"
      size="3xl"
    ></UAvatar>
    
    <UForm class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <UFormGroup class="mb-4" label="Full Name" name="name">
        <UInput :model-value="user.name" disabled />
      </UFormGroup>

      <UFormGroup label="Email Address" name="email">
        <UInput :model-value="user.email" disabled type="email" />
      </UFormGroup>
    </UForm>

    <template #footer>
      <UAlert
        icon="i-heroicons-information-circle-20-solid"
        color="blue"
        variant="soft"
        title="Using GitHub login"
        description="Your profile is loaded from GitHub, so you can't update your details on this page."
      />
      <!-- <UButton
        :to="user.url"
        icon="i-grommet-icons:github"
      >
        Visit profile on GitHub
      </UButton> -->
    </template>
  </UCard>
</template>