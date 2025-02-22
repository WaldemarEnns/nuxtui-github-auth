import { PrismaClient, type TeamInvitation, type TeamRole } from '@prisma/client'
import { BaseModel } from './BaseModel'
import { randomBytes } from 'crypto'

type CreateTeamInvitationData = {
  teamId: number
  email: string
  role?: TeamRole
}

type UpdateTeamInvitationData = Partial<CreateTeamInvitationData> & {
  isUsed?: boolean
}

export class TeamInvitationModel extends BaseModel<TeamInvitation> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient)
  }

  /**
   * Generate a unique invitation token
   * @returns A unique token string
   */
  private generateToken(): string {
    return randomBytes(32).toString('hex')
  }

  /**
   * Find an invitation by ID
   * @param id - The ID of the invitation to find
   * @returns The invitation if found, otherwise null
   */
  async findById(id: number): Promise<TeamInvitation | null> {
    return this.prisma.teamInvitation.findUnique({
      where: { id }
    })
  }

  /**
   * Find all invitations
   * @returns All invitations
   */
  async findAll(): Promise<TeamInvitation[]> {
    return this.prisma.teamInvitation.findMany()
  }

  /**
   * Create a new team invitation
   * @param data - The data of the invitation to create
   * @returns The created invitation
   */
  async create(data: CreateTeamInvitationData): Promise<TeamInvitation> {
    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    return this.prisma.teamInvitation.create({
      data: {
        ...data,
        token,
        expiresAt
      }
    })
  }

  /**
   * Update a team invitation
   * @param id - The ID of the invitation to update
   * @param data - The data to update
   * @returns The updated invitation
   */
  async update(id: number, data: UpdateTeamInvitationData): Promise<TeamInvitation> {
    return this.prisma.teamInvitation.update({
      where: { id },
      data
    })
  }

  /**
   * Delete a team invitation
   * @param id - The ID of the invitation to delete
   * @returns The deleted invitation
   */
  async delete(id: number): Promise<TeamInvitation> {
    return this.prisma.teamInvitation.delete({
      where: { id }
    })
  }

  /**
   * Find an invitation by token
   * @param token - The token to search for
   * @returns The invitation if found, otherwise null
   */
  async findByToken(token: string): Promise<TeamInvitation | null> {
    return this.prisma.teamInvitation.findUnique({
      where: { token }
    })
  }

  /**
   * Find all pending invitations for a team
   * @param teamId - The ID of the team
   * @returns All pending invitations for the team
   */
  async findPendingByTeamId(teamId: number): Promise<TeamInvitation[]> {
    return this.prisma.teamInvitation.findMany({
      where: {
        teamId,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })
  }

  /**
   * Find all pending invitations for an email
   * @param email - The email address to search for
   * @returns All pending invitations for the email
   */
  async findPendingByEmail(email: string): Promise<TeamInvitation[]> {
    return this.prisma.teamInvitation.findMany({
      where: {
        email,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        team: true
      }
    })
  }
} 