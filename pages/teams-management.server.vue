<script setup lang="ts">
import type { Team } from '@prisma/client'
const prisma = usePrismaClient()
const { user } = useUserSession()

const usersTeams = await prisma.user.findUnique({
  where: { id: user.value!.id },
  include: { ownedTeams: true }
})!.ownedTeams
</script>

<template>
  <h1>Teams management page</h1>
  <div>
    <h2>Owned teams</h2>
    <ul>
      <li v-for="team in usersTeams" :key="team.id">
        <NuxtLink :to="`/teams/${team.id}`">
          {{ team.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>