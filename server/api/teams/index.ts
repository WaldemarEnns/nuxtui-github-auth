import requiresAuth from '~/lib/middleware/auth'
import models from '~/services/models'
export default defineEventHandler(async (event) => {
  const user = await requiresAuth(event)

  const memberOf = await models.TeamMemberService.findByUserId(user.id)

  const teams = memberOf.map((member) => member.team)

  return teams
})