<script setup lang="ts">
const notificationsPermission = computed(() => {
  if (!'Notification' in window) {
    console.debug('Notifications are not supported in this browser')
    return false
  }

  return Notification.permission === 'granted'
})

function requestNotificationsPermission () {
  console.debug('Requesting notifications permission')
  if (Notification.permission === 'granted') {
    return;
  }

  Notification.requestPermission((permission) => {
    console.debug('Permission:', permission)
    if (permission === 'granted') {
      new Notification('You have granted permission to receive notifications');
    }
  })
}
</script>

<template>
  <ClientOnly>
    <UToggle
      color="primary"
      @click="requestNotificationsPermission"
      :model-value="notificationsPermission"
      :disabled="notificationsPermission"
      on-icon="i-heroicons-check-20-solid"
      off-icon="i-heroicons-x-mark-20-solid"
    >
      {{ notificationsPermission ? 'Disable' : 'Enable' }} notifications
    </UToggle>
  </ClientOnly>
</template>