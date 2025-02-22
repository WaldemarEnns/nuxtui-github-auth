<script setup lang="ts">
import { UButton } from '#components'
import type { TeamRole } from '@prisma/client'

const user = useUserSession()
const toast = useToast()

const userId = computed(() => user.user.value?.id)

const { data: teamsData, refresh } = useFetch('/api/teams')

const members = computed(() => {
  const team = teamsData.value?.find((team) => selectedTeam.value !== undefined && team.id === parseInt(selectedTeam.value))
  return team?.teamMembers.map((user) => ({
    id: user.userId,
    name: user.user.full_name,
    email: user.user.email,
    role: user.role
  })) ?? []
})

const teamsOptions = computed(() => {
  return teamsData.value?.map((team) => ({
    label: team.name,
    value: team.id,
  })) ?? []
})

const selectedTeam = ref(teamsOptions.value[0]?.value.toString() ?? undefined)

const { data: invitationsData, refresh: refreshInvitations } = useFetch(`/api/teams/${selectedTeam.value}/invitations`)

const tableColumns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'actions',
    label: 'Actions',
  }
]

const invitationColumns = [
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'expiresAt',
    label: 'Expires in',
  },
  {
    key: 'actions',
    label: 'Actions',
  }
]

function getRoleColor(role: TeamRole) {
  switch (role) {
    case 'ADMIN':
      return 'teal'
    case 'MEMBER':
      return 'indigo'
  }
}

async function removeMember(userId: number) {
  try {
    const { status, data, error } = await useFetch(`/api/teams/${selectedTeam.value}/remove/${userId}`, {
      method: 'DELETE',
    })

    if (error.value && status.value === 'error') {
      throw new Error(error.value.message)
    }

    await refresh()

    toast.add({
      id: 'member-removed',
      title: 'Member removed successfully',
      description: 'The team member has been removed from the team',
      icon: 'i-heroicons-check-circle',
      timeout: 3000,
      color: 'green'
    })
  } catch (error) {
    toast.add({
      id: 'member-remove-error',
      title: 'Error removing member',
      description: 'Could not remove the team member. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000,
      color: 'red'
    })
  }
}

const email = ref('')
const role = ref('MEMBER')

const rolesOptions = computed(() => {
  return ['MEMBER', 'ADMIN']
})

function duration(date: string) {
  const now = new Date()
  const expiresAt = new Date(date)
  const diff = expiresAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return 'expired'
  } else if (diffDays === 1) {
    return 'expires tomorrow'
  } else if (diffDays < 7) {
    return `expires in ${diffDays} days`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `expires in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
  } else {
    const months = Math.floor(diffDays / 30)
    return `expires in ${months} ${months === 1 ? 'month' : 'months'}`
  }
}

async function addMember() {
  try {
    const { status, data, error } = await useFetch(`/api/teams/${selectedTeam.value}/invite`, {
      method: 'POST',
      body: {
        email: email.value,
        role: role.value
      }
    })

    if (error.value && status.value === 'error') {
      throw new Error(error.value.message)
    }

    await refreshInvitations()

    toast.add({
      id: 'member-added',
      icon: 'i-heroicons-check-circle',
      timeout: 3000,
      color: 'green',
      title: 'Member added successfully',
      description: 'The team member has been added to the team',
    })
  } catch (error) {
    toast.add({
      id: 'member-add-error',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000,
      color: 'red',
      title: 'Error adding member',
      description: 'Could not add the team member. Please try again.',
    })
  }
}

async function cancelInvitation(invitationId: number) {
  try {
    const { status, data, error } = await useFetch(`/api/teams/${selectedTeam.value}/invitations/${invitationId}/cancel`, {
      method: 'DELETE',
    })

    if (error.value && status.value === 'error') {
      throw new Error(error.value.message)
    }

    await refreshInvitations()

    toast.add({
      id: 'invitation-cancelled',
      title: 'Invitation cancelled',
      description: 'The invitation has been cancelled and the user has been notified.',
      icon: 'i-heroicons-check-circle',
      timeout: 3000,
      color: 'green'
    })
  } catch (error) {
    toast.add({
      id: 'invitation-cancel-error',
      title: 'Error cancelling invitation',
      description: 'Could not cancel the invitation. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000,
      color: 'red'
    })
  }
}

const invitations = computed(() => {
  return invitationsData.value?.map((invitation) => ({
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    expiresAt: duration(invitation.expiresAt),
  })) ?? []
})
</script>

<template>
  <UCard
    class="mb-4"
  >
    <template #header>
      <h1>Teams management</h1>
    </template>
     <USelect
      v-model="selectedTeam"
      :options="teamsOptions"
      class="mb-2"
    />
    <UTable
      :columns="tableColumns"
      :rows="members"
    >
      <template #name-data="{ row }">
        <span class="mr-2">
          {{ row.name }}
        </span>
        <UBadge
          v-if="row.id === userId"
          color="primary"
          size="sm"
          variant="outline"
          :ui="{
            rounded: 'rounded-full',
          }"
        >
          you
        </UBadge>
      </template>
      <template #role-data="{ row }">
        <UBadge
          :color="getRoleColor(row.role)"
          variant="outline"
        >
          {{ row.role }}
        </UBadge>
        <UBadge
          v-if="false"
          class="ml-2"
          color="primary"
        >
          OWNER
        </UBadge>
      </template>

      <template #actions-data="{ row }">
        <UButton
          :disabled="row.id === userId"
          :color="row.id === userId ? 'gray' : 'red'"
          variant="outline"
          icon="i-heroicons-user-minus"
          @click="removeMember(row.id)"
        >
          Remove
        </UButton>
      </template>
    </UTable>
  </UCard>

  <UCard
    class="mb-4"
  >
    <template #header>
      <h1>Add member</h1>
    </template>
    
    <UFormGroup
      label="Email"
      class="mb-2"
    >
      <UInput v-model="email" />
    </UFormGroup>

    <UFormGroup
      label="Role"
      class="mb-2"
    >
      <USelect v-model="role" :options="rolesOptions" />
    </UFormGroup>

    <UButton @click="addMember">Add member</UButton>
  </UCard>

  <UCard
    class="mb-4"
  >
    <template #header>
      <h1>Invitations</h1>
    </template>

    <UTable
      :columns="invitationColumns"
      :rows="invitations"
    >
      <template #role-data="{ row }">
        <UBadge :color="getRoleColor(row.role)" variant="outline">
          {{ row.role }}
        </UBadge>
      </template>

      <template #actions-data="{ row }">
        <UButton
          color="red"
          variant="outline"
          icon="i-heroicons-x-circle"
          @click="cancelInvitation(row.id)"
        >
          Cancel invitation
        </UButton>
      </template>
    </UTable>
  </UCard>
</template>