import { findOrCreateGitHubUser } from '~/services/userService';
import { createInitialTeam } from '~/services/teamService';
import { sendMail } from '~/services/emailService';
import type { User as GitHubUser } from '#auth-utils';

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user: githubUser }: { user: GitHubUser }) {
    const { databaseUser, isNewUser } = await findOrCreateGitHubUser(githubUser);

    await setUserSession(event, {
      user: {
        avatar_url: databaseUser.avatar_url ?? null,
        email: databaseUser.email,
        name: databaseUser.full_name,
        url: githubUser.url,
        id: databaseUser.id,
      }
    })
    
    if (isNewUser) {
      await createInitialTeam(databaseUser);
      try {
        await sendMail(
          'Welcome! 👋🏼',
          databaseUser.email,
          'We are excited to have you on board! Get started by exploring your dashboard and creating your first project.',
          'default',
          {
            appName: process.env.APP_NAME || 'Nuxt SaaS Template',
            title: `Welcome to ${process.env.APP_NAME || 'Nuxt SaaS Template'} 👋🏼`,
            actionUrl: process.env.APP_URL || '/',
            actionText: 'Go to Dashboard'
          }
        );
      } catch (error) {
        console.error('Error sending welcome email: ', error)
      }
    }

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    return sendRedirect(event, '/login')
  },
})