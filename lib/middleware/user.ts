import type { H3Event, EventHandlerRequest } from 'h3'
import type { User } from '@prisma/client'
import prisma from '~/lib/prisma'

export default async function ownsTeam(event: H3Event<EventHandlerRequest>, user: User, teamId: number): Promise<boolean> {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
      ownerId: user.id
    }
  })

  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found'
    })
  } else {
    return true
  }
}

export async function isTeamAdmin(event: H3Event<EventHandlerRequest>, user: User, teamId: number): Promise<boolean> {
  // First check if user is the owner of the team
  const isOwner = await ownsTeam(event, user, teamId)
  if (isOwner) {
    return true
  }

  // If not owner, check if user is an admin member
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: user.id,
      teamId: teamId,
      role: 'ADMIN'
    }
  })

  if (!teamMember) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have admin permissions for this team'
    })
  }

  return true
}

