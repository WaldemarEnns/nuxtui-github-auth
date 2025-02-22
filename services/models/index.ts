import { PrismaClient } from '@prisma/client'
import { ModelFactory } from './ModelFactory'

const prisma = new PrismaClient()
const factory = new ModelFactory(prisma)

export default {
  UserService: factory.getUserModel(),
  TeamService: factory.getTeamModel(),
  TeamMemberService: factory.getTeamMemberModel(),
  TeamInvitationService: factory.getTeamInvitationModel()
}