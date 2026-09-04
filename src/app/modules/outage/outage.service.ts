import { prisma } from "../../lib/prisma"
import { IOutagePayload } from "./outage.interface"

export const createOutageInDb = async (payload: IOutagePayload, userId: string) => {

    const { cause, description, priority } = payload






    const outageCreatedResult = await prisma.outage.create({
        data: {
            cause,
            description,
            priority,
            userId
        }
    })
    return outageCreatedResult
}



export const OutageService = {
    createOutageInDb
}