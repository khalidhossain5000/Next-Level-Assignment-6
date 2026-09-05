

export interface IPlannedOutagePayload {
    title:string;
    reason:string;
    description:string;
    startTime: Date;
    endTime: Date;
    areaId:string;
}