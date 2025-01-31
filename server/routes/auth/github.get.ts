export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        avatar_url: user.avatar_url ?? null,
        email: user.email,
        name: user.name,
        url: user.url,
      }
    })
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    return sendRedirect(event, '/login')
  },
})