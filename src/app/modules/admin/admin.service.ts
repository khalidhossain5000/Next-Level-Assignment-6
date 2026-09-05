import { prisma } from "../../lib/prisma"

const getAllUsersFromDb=async()=>{
    const result=await prisma.user.findMany()

    return result
}



export const AdminService = {
    getAllUsersFromDb
}