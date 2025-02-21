import prisma from '~/lib/prisma'

/**
 * Deletes a team member from the database. 
 * @param memberId The ID of the team member to delete.
 */
export default async function deleteMember(memberId: number) {
  await prisma.teamMember.delete({
    where: { id: memberId }
  })
}