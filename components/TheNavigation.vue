<script setup lang="ts">
import type { User } from '#auth-utils';

const props = defineProps<{
  user: User
}>()

const links = computed(() => ([
  [{
    label: 'Profile',
    avatar: {
      src: props.user.avatar_url,
    },
    badge: 0,
    to: '/profile',
  },
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog',
    to: '/settings'
  }, {
    label: 'Teams',
    icon: 'i-heroicons-users',
    to: '/teams-management'
  }],
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    to: '/auth/logout',
    external: true,
  }]
]))
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800"
    :ui="{
      wrapper: 'sticky top-0 z-10 bg-white dark:bg-gray-900',
    }"
  />
</template>