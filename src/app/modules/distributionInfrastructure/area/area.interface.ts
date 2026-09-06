
export interface IAreaInterface{
    name:string;
    code:string;
    address:string;
    feederId:string;
}

export interface IUpdateAreaPayload {
    name?: string;
    code?: string;
    address?: string;
    feederId?: string;
    status?: "ACTIVE" | "INACTIVE";
}