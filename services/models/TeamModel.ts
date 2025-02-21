import { PrismaClient } from '@prisma/client'
import type { Team } from '@prisma/client'
import { BaseModel } from './BaseModel'

type CreateTeamData = {
  ownerId: number
  name: string
}

type UpdateTeamData = Partial<Omit<CreateTeamData, 'ownerId'>>

export class TeamModel extends BaseModel<Team> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient)
  }

  /**
   * Find a team by their ID
   * @param id - The ID of the team to find
   * @returns The team if found, otherwise null
   */
  async findById(id: number): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id }
    })
  }

  /**
   * Find all teams
   * @returns All teams
   */
  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany()
  }

  /**
   * Create a new team
   * @param data - The data of the team to create
   * @returns The created team
   */
  async create(data: CreateTeamData): Promise<Team> {
    return this.prisma.team.create({
      data
    })
  }

  /**
   * Update a team
   * @param id - The ID of the team to update
   * @param data - The data of the team to update
   * @returns The updated team
   */
  async update(id: number, data: UpdateTeamData): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data
    })
  }

  /**
   * Delete a team
   * @param id - The ID of the team to delete
   * @returns The deleted team
   */
  async delete(id: number): Promise<Team> {
    return this.prisma.team.delete({
      where: { id }
    })
  }

  /**
   * Find a team with their owner and their team members
   * @param id - The ID of the team to find
   * @returns The team with their owner and their team members
   */
  async findWithMembers(id: number): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        owner: true,
        teamMembers: {
          include: {
            user: true
          }
        }
      }
    })
  }

  /**
   * Find all teams by their owner ID
   * @param ownerId - The ID of the owner of the teams to find
   * @returns All teams owned by the owner
   */
  async findByOwnerId(ownerId: number): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: { ownerId }
    })
  }
} 