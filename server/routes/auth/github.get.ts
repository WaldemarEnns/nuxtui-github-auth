import prisma from '~/lib/prisma'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    const databaseUser = await prisma.user.upsert({
      where: { email: user.email, auth_provider: 'github', auth_provider_user_id: user.id },
      update: {
        full_name: user.name,
        avatar_url: user.avatar_url
      },
      create: {
        email: user.email,
        avatar_url: user.avatar_url,
        full_name: user.name,
        auth_provider: 'github',
        auth_provider_user_id: user.id
      }
    })

    await setUserSession(event, {
      user: {
        avatar_url: databaseUser.avatar_url ?? null,
        email: databaseUser.email,
        name: databaseUser.full_name,
        url: user.url,
      }
    })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    return sendRedirect(event, '/login')
  },
})