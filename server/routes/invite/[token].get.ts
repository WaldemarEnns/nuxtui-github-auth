import requiresAuth from "~/lib/middleware/auth"
import models from '~/services/models/index'

export default defineEventHandler(async (event) => {
  const { token } = getRouterParams(event)

  // Find and validate invitation first
  const invitation = await models.TeamInvitationService.findByToken(token)
  if (!invitation) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invitation not found'
    })
  }

  // Check if invitation is expired
  if (invitation.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invitation has expired'
    })
  }

  // Check if invitation is already used
  if (invitation.isUsed) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invitation has already been used'
    })
  }

  // Try to get the current user session
  const session = await getUserSession(event)
  
  // If no user is logged in, store the invitation token and redirect to login
  if (!session.user) {
    await setUserSession(event, {
      pendingInvitation: token
    })
    return sendRedirect(event, '/login')
  }

  // Get the full user record
  const user = await requiresAuth(event)

  // Check if email matches
  if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This invitation was sent to a different email address'
    })
  }

  // Check if user is already a member
  const existingMember = await models.TeamMemberService.findByTeamAndUser(invitation.teamId, user.id)
  if (existingMember) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You are already a member of this team'
    })
  }

  // Create team member
  const teamMember = await models.TeamMemberService.create({
    teamId: invitation.teamId,
    userId: user.id,
    role: invitation.role
  })

  // Mark invitation as used
  await models.TeamInvitationService.update(invitation.id, {
    isUsed: true
  })

  return sendRedirect(event, '/')
}) 