import prisma from '~/lib/prisma';
import type { User } from '@prisma/client';

/**
 * Create an initial team for a user
 * @param user - The user to create the team for
 * @returns The created team
 */
export async function createInitialTeam(user: User) {
  return prisma.team.create({
    data: {
      owner: { connect: { id: user.id } },
      name: `${user.full_name}'s Team`,
      teamMembers: {
        create: {
          user: { connect: { id: user.id } },
          role: 'ADMIN'
        }
      }
    }
  });
}

/**
 * Get all teams owned by a user
 * @param userId - The ID of the user
 * @returns All teams owned by the user
 */
export async function getOwnedTeams(userId: number) {
  return prisma.team.findMany({
    where: {
      ownerId: userId
    },
    include: {
      teamMembers: {
        include: {
          user: true
        }
      }
    }
  })
}

