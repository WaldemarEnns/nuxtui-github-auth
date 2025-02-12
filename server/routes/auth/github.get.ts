import prisma from '~/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import mjml2html from 'mjml'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    // MJML-Template laden
    let mjmlTemplate = await fs.readFile('emails/templates/default.mjml', 'utf-8')

    // MJML in HTML umwandeln
    const { html, errors } = mjml2html(mjmlTemplate)

    if (errors.length > 0) {
      console.error('MJML Errors:', errors)
      return sendError(event, new Error('Internal Server Error: Parsing MJML template failed.'))
    }  

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

    const { sendMail } = useNodeMailer()

    await setUserSession(event, {
      user: {
        avatar_url: databaseUser.avatar_url ?? null,
        email: databaseUser.email,
        name: databaseUser.full_name,
        url: user.url,
      }
    })
    
    try {
      await sendMail({
        subject: 'Welcome to our platform! 👋🏼',
        html: html,
        to: databaseUser.email,
      })
    } catch (error) {
      console.error('Error sending email:', error)
    }

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    return sendRedirect(event, '/login')
  },
})