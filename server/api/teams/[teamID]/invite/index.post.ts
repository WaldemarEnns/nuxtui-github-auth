import requiresAuth from "~/lib/middleware/auth"
import models from '~/services/models/index'
import { sendMail } from '~/services/emailService'
import { TeamRole } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { teamID } = getRouterParams(event)
  const body = await readBody(event)
  
  // Validate input
  if (!body.email || typeof body.email !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }

  const role = body.role as TeamRole | undefined

  const user = await requiresAuth(event)

  const team = await models.TeamService.findById(parseInt(teamID))
  if (!team) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found'
    })
  }

  // Check if user has permission to invite (must be owner or admin)
  const teamMember = await models.TeamMemberService.findByTeamAndUser(parseInt(teamID), user.id)
  if (!teamMember || (teamMember.role !== TeamRole.ADMIN && team.ownerId !== user.id)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to invite members to this team'
    })
  }

  // Check if user is already a member
  const existingMember = await models.UserService.findByEmail(body.email)
  if (existingMember) {
    const isMember = await models.TeamMemberService.findByTeamAndUser(parseInt(teamID), existingMember.id)
    if (isMember) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User is already a member of this team'
      })
    }
  }

  // Create invitation
  const invitation = await models.TeamInvitationService.create({
    teamId: parseInt(teamID),
    email: body.email,
    role
  })

  // Send invitation email
  const inviteUrl = `${process.env.APP_URL}/invite/${invitation.token}`
  try {
    await sendMail(
      'Team Invitation 🎉',
      body.email,
      `You've been invited to join the team "${team.name}"!`,
      'default',
      {
        appName: process.env.APP_NAME || 'Nuxt SaaS Template',
        title: `Join ${team.name} on ${process.env.APP_NAME || 'Nuxt SaaS Template'} 🎉`,
        actionUrl: inviteUrl,
        actionText: 'Accept Invitation'
      }
    )
  } catch (error) {
    console.error('Error sending invitation email:', error)
    // Don't fail the request if email fails, but log it
  }

  return {
    message: 'Invitation sent successfully',
    invitation: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt
    }
  }
}) 