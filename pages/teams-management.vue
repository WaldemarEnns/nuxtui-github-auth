<script setup lang="ts">
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

    toast.add({
      id: 'member-added',
      title: 'Member added successfully',
      description: 'The team member has been added to the team',
    })
  } catch (error) {
    toast.add({
      id: 'member-add-error',
      title: 'Error adding member',
      description: 'Could not add the team member. Please try again.',
    })
  }
}
</script>

<template>
  <UCard>
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
      <template #role-data="{ row }">
        <UBadge
          :color="getRoleColor(row.role)"
          variant="outline"
        >
          {{ row.role }}
        </UBadge>
        <UBadge
          v-if="row.id === userId"
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

  <UCard>
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
</template>