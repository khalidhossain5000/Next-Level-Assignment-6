
export interface IOutagePayload {
    cause:string;
    description:string;
    areaId:string;
}

export interface IOutageUpdatePayload {
    cause?:string;
    description?:string;
    areaId?:string;
}