

export interface ILoadSheddingPayload {
    title: string;
    startTime: Date;
    endTime: Date;
    reason?: string;
    areaId: string;
}


export interface ILoadSheddingUpdatePayload {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    reason?: string;
   
}