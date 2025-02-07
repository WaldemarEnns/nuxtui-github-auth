<template>
  <UCard>
    <template #header>
      <h1>Settings</h1>
    </template>

    <UFormGroup label="Theme" class="mb-4">
      <div class="flex flex-row justify-start items-center">
        <ThemeSwitch />
        <span class="ml-2">Switch your theme</span>
      </div>
    </UFormGroup>

    <UFormGroup label="Notifications" name="notifications">
      <div class="flex flex-row justify-start items-center">
        <NotificationsPermissionSwitch />
        <span class="ml-2">Enable or disable notifications</span>
      </div>
    </UFormGroup>
  </UCard>
</template>