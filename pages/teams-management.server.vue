<script setup lang="ts">
import type { Team } from '@prisma/client'
const prisma = usePrismaClient()
const { user } = useUserSession()

const userId = user.value!.id
const dbUser = await prisma.user.findUnique({
  where: {
    id: userId
  },
  include: {
    ownedTeams: true
  }
})

const ownedTeams: Team[] = dbUser!.ownedTeams
</script>

<template>
  <h1>Teams management page</h1>
  <div>
    <h2>Owned teams</h2>
    <ul>
      <li v-for="team in ownedTeams" :key="team.id">
        <NuxtLink :to="`/teams/${team.id}`">
          {{ team.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>