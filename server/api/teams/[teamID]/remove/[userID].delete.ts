import requiresAuth from '~/lib/middleware/auth'
import ownsTeam from '~/lib/middleware/user'
import prisma from '~/lib/prisma'
import type { User } from '@prisma/client'
import deleteMember from '~/services/teamMemberService'

export default defineEventHandler(async (event) => {
  const user: User = await requiresAuth(event)
  
  const teamID = getRouterParam(event, 'teamID')
  const userID = getRouterParam(event, 'userID')

  if (!teamID || !userID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID and user ID are required'
    })
  }

  const ownTeam = await ownsTeam(event, user, parseInt(teamID))

  const member = await prisma.teamMember.findFirst({
    where: {
      userId: parseInt(userID),
      teamId: parseInt(teamID)
    }
  })

  if (!member) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team member not found'
    })
  }

  if (ownTeam && member.userId === user.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot remove yourself from your own team'
    })
  }

  try {
    await deleteMember(member.id)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete team member'
    })
  }
  return {
    success: true
  }
})