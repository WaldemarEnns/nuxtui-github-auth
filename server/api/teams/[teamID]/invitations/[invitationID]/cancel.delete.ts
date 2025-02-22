import requiresAuth from "~/lib/middleware/auth"
import models from '~/services/models/index'
import { sendMail } from '~/services/emailService'
import { isTeamAdmin } from "~/lib/middleware/user"

export default defineEventHandler(async (event) => {
  const { teamID, invitationID } = getRouterParams(event)
  const user = await requiresAuth(event)

  // Find the team
  const team = await models.TeamService.findById(parseInt(teamID))
  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found'
    })
  }

  const isAdmin = await isTeamAdmin(event, user, team.id)
  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to cancel invitations for this team'
    })
  }

  // Find the invitation
  const invitation = await models.TeamInvitationService.findById(parseInt(invitationID))
  if (!invitation) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invitation not found'
    })
  }

  // Check if invitation belongs to the team
  if (invitation.teamId !== parseInt(teamID)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invitation does not belong to this team'
    })
  }

  // Check if invitation is already used or expired
  if (invitation.isUsed || invitation.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invitation is already used or expired'
    })
  }

  // Delete the invitation
  await models.TeamInvitationService.delete(invitation.id)

  // Send cancellation email
  try {
    await sendMail(
      'Team Invitation Cancelled',
      invitation.email,
      `The invitation to join the team "${team.name}" has been cancelled.`,
      'default',
      {
        appName: process.env.APP_NAME || 'Nuxt SaaS Template',
        title: `Team Invitation Cancelled`,
        content: `The invitation to join the team "${team.name}" has been cancelled by a team administrator.`
      }
    )
  } catch (error) {
    console.error('Error sending cancellation email:', error)
    // Don't fail the request if email fails, but log it
  }

  return {
    message: 'Invitation cancelled successfully'
  }
}) 