import { findOrCreateGitHubUser } from '~/services/userService';
import { createInitialTeam } from '~/services/teamService';
import { sendWelcomeEmail } from '~/services/emailService';
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
      await sendWelcomeEmail(databaseUser.email);
    }

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    return sendRedirect(event, '/login')
  },
})