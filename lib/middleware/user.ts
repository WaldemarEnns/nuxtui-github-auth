import type { H3Event, EventHandlerRequest } from 'h3'
import type { User } from '@prisma/client'
import prisma from '~/lib/prisma'

export default async function ownsTeam(event: H3Event<EventHandlerRequest>, user: User, teamId: number): Promise<void> {
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
    return
  }
}

