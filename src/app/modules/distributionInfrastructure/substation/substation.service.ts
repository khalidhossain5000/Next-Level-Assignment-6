import { prisma } from "../../../lib/prisma"
import type { ISubstationPayload } from "./substation.interface"

const createSubstation=async(payload:ISubstationPayload)=>{
    const {name,code,capacity,location,zoneId} =payload


    const createdSubstationResult=await prisma.substation.create({
        data:{
            name,
            capacity,
            code,
            location,
            zoneId
            
        },
        include:{
            zone:true,
            feeders:true
        }
    })
return createdSubstationResult

}



export const SubstationService={
    createSubstation
}