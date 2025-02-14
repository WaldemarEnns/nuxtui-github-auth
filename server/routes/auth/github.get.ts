import prisma from '~/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import mjml2html from 'mjml'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    let databaseUser = await prisma.user.findUnique({
      where: {
        email: user.email,
        auth_provider: 'github',
        auth_provider_user_id: user.id,
      },
    })

    let isUserNew = false
    if (!databaseUser) {
      isUserNew = true
      databaseUser = await prisma.user.create({
        data: {
          email: user.email,
          avatar_url: user.avatar_url,
          full_name: user.name,
          auth_provider: 'github',
          auth_provider_user_id: user.id,
        },
      })
    } else {
      databaseUser = await prisma.user.update({
        where: {
          email: user.email,
          auth_provider: 'github',
          auth_provider_user_id: user.id,
        },
        data: {
          full_name: user.name,
          avatar_url: user.avatar_url,
        },
      })
    }

    await setUserSession(event, {
      user: {
        avatar_url: databaseUser.avatar_url ?? null,
        email: databaseUser.email,
        name: databaseUser.full_name,
        url: user.url,
      }
    })
    
    if (isUserNew) {
      // Create an initial team for the new user, and create a TeamMember record assigning them as ADMIN.
      const team = await prisma.team.create({
        data: {
          owner: { connect: { id: databaseUser.id } },
          name: `${user.name}'s Team`,
          teamMembers: {
            create: {
              user: { connect: { id: databaseUser.id } },
              role: 'ADMIN'  // Assign the user as ADMIN of their own team
            }
          }
        }
      });
      const { sendMail } = useNodeMailer()
      let mjmlTemplate = await fs.readFile('emails/templates/default.mjml', 'utf-8')
      const { html, errors } = mjml2html(mjmlTemplate)

      if (errors.length > 0) {
        console.error('MJML Errors:', errors)
      }  

      try {
        await sendMail({
          subject: 'Welcome to our platform! 👋🏼',
          html: html,
          to: databaseUser.email,
        })
      } catch (error) {
        console.error('Error sending email:', error)
      }
    }

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    return sendRedirect(event, '/login')
  },
})