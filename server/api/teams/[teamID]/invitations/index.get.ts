import requiresAuth from "~/lib/middleware/auth"
import models from '~/services/models/index'
import ownsTeam from "~/lib/middleware/user"

export default defineEventHandler(async (event) => {
  const { teamID } = getRouterParams(event)
  const user = await requiresAuth(event)

  const team = await models.TeamService.findById(parseInt(teamID))
  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found'
    })
  }

  const isOwner = ownsTeam(event, user, team.id)
  if (!isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to view team invitations'
    })
  }

  const invitations = await models.TeamInvitationService.findPendingByTeamId(parseInt(teamID))

  return invitations
}) 