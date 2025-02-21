import { PrismaClient } from '@prisma/client'
import { UserModel } from './UserModel'
import { TeamModel } from './TeamModel'
import { TeamMemberModel } from './TeamMemberModel'

/**
 * A factory for creating models
 */
export class ModelFactory {
  private prisma: PrismaClient
  private userModel: UserModel | null = null
  private teamModel: TeamModel | null = null
  private teamMemberModel: TeamMemberModel | null = null

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  /**
   * Get the user model
   * @returns The user model
   */
  getUserModel(): UserModel {
    if (!this.userModel) {
      this.userModel = new UserModel(this.prisma)
    }
    return this.userModel
  }

  /**
   * Get the team model
   * @returns The team model
   */
  getTeamModel(): TeamModel {
    if (!this.teamModel) {
      this.teamModel = new TeamModel(this.prisma)
    }
    return this.teamModel
  }

  /**
   * Get the team member model
   * @returns The team member model
   */
  getTeamMemberModel(): TeamMemberModel {
    if (!this.teamMemberModel) {
      this.teamMemberModel = new TeamMemberModel(this.prisma)
    }
    return this.teamMemberModel
  }
} 