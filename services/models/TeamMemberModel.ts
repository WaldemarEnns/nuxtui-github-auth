import { PrismaClient } from '@prisma/client'
import type { TeamMember, TeamRole } from '@prisma/client'
import { BaseModel } from './BaseModel'

type CreateTeamMemberData = {
  teamId: number
  userId: number
  role?: TeamRole
}

type UpdateTeamMemberData = {
  role: TeamRole
}

export class TeamMemberModel extends BaseModel<TeamMember> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient)
  }

  /**
   * Find a team member by their ID
   * @param id - The ID of the team member to find
   * @returns The team member if found, otherwise null
   */
  async findById(id: number): Promise<TeamMember | null> {
    return this.prisma.teamMember.findUnique({
      where: { id }
    })
  }

  /**
   * Find all team members
   * @returns All team members
   */
  async findAll(): Promise<TeamMember[]> {
    return this.prisma.teamMember.findMany()
  }

  /**
   * Create a new team member
   * @param data - The data of the team member to create
   * @returns The created team member
   */
  async create(data: CreateTeamMemberData): Promise<TeamMember> {
    return this.prisma.teamMember.create({
      data
    })
  }

  /**
   * Update a team member
   * @param id - The ID of the team member to update
   * @param data - The data of the team member to update
   * @returns The updated team member
   */
  async update(id: number, data: UpdateTeamMemberData): Promise<TeamMember> {
    return this.prisma.teamMember.update({
      where: { id },
      data
    })
  }

  /**
   * Delete a team member
   * @param id - The ID of the team member to delete
   * @returns The deleted team member
   */
  async delete(id: number): Promise<TeamMember> {
    return this.prisma.teamMember.delete({
      where: { id }
    })
  }

  /**
   * Find all team members by their team ID
   * @param teamId - The ID of the team to find the members of
   * @returns All team members of the team
   */
  async findByTeamId(teamId: number): Promise<TeamMember[]> {
    return this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: true
      }
    })
  }

  /**
   * Find all team members by their user ID
   * @param userId - The ID of the user to find the members of
   * @returns All team members of the user
   */
  async findByUserId(userId: number): Promise<TeamMember[]> {
    return this.prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: true
      }
    })
  }

  /**
   * Find a team member by their team ID and user ID
   * @param teamId - The ID of the team to find the member of
   * @param userId - The ID of the user to find the member of
   * @returns The team member if found, otherwise null
   */
  async findByTeamAndUser(teamId: number, userId: number): Promise<TeamMember | null> {
    return this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId
      }
    })
  }
} 