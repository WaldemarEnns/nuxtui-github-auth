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
        await sendMail('Welcome! 👋🏼', databaseUser.email);
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