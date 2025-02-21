import requiresAuth from '~/lib/middleware/auth'
import { getOwnedTeams } from '~/services/teamService'

export default defineEventHandler(async (event) => {
  const user = await requiresAuth(event)

  const teams = await getOwnedTeams(user.id)

  return teams
})