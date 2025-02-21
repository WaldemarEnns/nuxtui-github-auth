import type { User } from '#auth-utils';
import type { User as UserModel } from '@prisma/client'
import prisma from '~/lib/prisma'

type CreatedUser = {
  databaseUser: UserModel,
  isNewUser: boolean
}

export async function findOrCreateGitHubUser(user: User): Promise<CreatedUser> {
  const { email, id, avatar_url, name } = user;
  let databaseUser = await prisma.user.findUnique({
    where: { email, auth_provider: 'github', auth_provider_user_id: id }
  });
  let isNewUser = false;
  if (!databaseUser) {
    isNewUser = true;
    databaseUser = await prisma.user.create({
      data: {
        email,
        avatar_url,
        full_name: name,
        auth_provider: 'github',
        auth_provider_user_id: id
      }
    });
  } else {
    databaseUser = await prisma.user.update({
      where: { email, auth_provider: 'github', auth_provider_user_id: id },
      data: { full_name: name, avatar_url }
    });
  }
  return { databaseUser, isNewUser };
}

export async function getUser(user: User): Promise<UserModel> {
  const dbUser: UserModel | null = await prisma.user.findUnique({
    where: { id: user.id }
  })
  
  if (!dbUser) {
    throw new Error('User not found.')
  }
  
  return dbUser
}
