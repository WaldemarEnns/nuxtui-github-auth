import { PrismaClient } from '@prisma/client'

interface IBaseModel<T> {
  findById(id: number): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: any): Promise<T>
  update(id: number, data: any): Promise<T>
  delete(id: number): Promise<T>
}

abstract class BaseModel<T> implements IBaseModel<T> {
  protected prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  abstract findById(id: number): Promise<T | null>
  abstract findAll(): Promise<T[]>
  abstract create(data: any): Promise<T>
  abstract update(id: number, data: any): Promise<T>
  abstract delete(id: number): Promise<T>
}

export type { IBaseModel }
export { BaseModel }