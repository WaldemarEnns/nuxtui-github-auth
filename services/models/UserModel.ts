import { PrismaClient, type User } from '@prisma/client'
import { BaseModel } from './BaseModel'

type CreateUserData = {
  email: string
  auth_provider_user_id: number
  auth_provider?: string
  full_name: string
  avatar_url?: string
}

type UpdateUserData = Partial<CreateUserData>

export class UserModel extends BaseModel<User> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient)
  }

  /**
   * Find a user by their ID
   * @param id - The ID of the user to find
   * @returns The user if found, otherwise null
   */
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  /**
   * Find all users
   * @returns All users
   */
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  /**
   * Find a user by their email
   * @param email - The email of the user to find
   * @returns The user if found, otherwise null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  /**
   * Create a new user
   * @param data - The data of the user to create
   * @returns The created user
   */
  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data
    })
  }

  /**
   * Update a user
   * @param id - The ID of the user to update
   * @param data - The data of the user to update
   * @returns The updated user
   */
  async update(id: number, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    })
  }

  /**
   * Delete a user
   * @param id - The ID of the user to delete
   * @returns The deleted user
   */
  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    })
  }

  /**
   * Find a user with their owned teams and their team members
   * @param id - The ID of the user to find
   * @returns The user with their teams
   */
  async findWithTeams(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        ownedTeams: true,
        teamMembers: {
          include: {
            team: true
          }
        }
      }
    })
  }
} 