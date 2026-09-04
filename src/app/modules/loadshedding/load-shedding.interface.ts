type LoadSheddingStatus =
    | "ONGOING"
    | "SCHEDULED"
    | "CANCELLED"
    | "COMPLETED";

export interface ILoadSheddingPayload {
    title: string;
    startTime: Date;
    endTime: Date;
    status?: LoadSheddingStatus;
    reason?: string;
    areaId: string;
}