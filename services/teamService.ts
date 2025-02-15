import prisma from '~/lib/prisma';
import type { User } from '@prisma/client';

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