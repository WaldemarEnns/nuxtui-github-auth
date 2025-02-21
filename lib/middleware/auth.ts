import type { H3Event, EventHandlerRequest } from 'h3'
import type { User } from '@prisma/client'
import prisma from '~/lib/prisma'

export default async function requiresAuth(event: H3Event<EventHandlerRequest>): Promise<User> {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  return dbUser
} 