<script setup lang="ts">
const toast = useToast()

const notificationsPermission = computed(() => {
  if (!'Notification' in window) {
    console.debug('Notifications are not supported in this browser')
    return false
  }

  return Notification.permission === 'granted'
})

function requestNotificationsPermission () {
  if (Notification.permission === 'granted') {
    return;
  }

  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      new Notification('You have granted permission to receive notifications');
    } else {
      toast.add({
        id: 'notificaitons-denied',
        title: 'Notifications permission denied',
        description: 'Notifications could not be enabled. Please enable them in your browser settings.',
        icon: 'i-grommet-icons:status-warning',
        timeout: 6000,
        color: 'red'
      })
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