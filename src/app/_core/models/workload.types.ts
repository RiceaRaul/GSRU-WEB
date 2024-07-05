export interface Workload{
    id: number;
    employee: string;
    employeeId: string;
    hour: number;
    total: number;
    [day: string]: number | string;
}


export interface WorkloadData {
    data:Workload[],
    id:number,
    sprintId:number,
    totalHours:number,
    totalHoursSupport:number,
    supportPercent:number
    dateStart:Date,
    dateEnd:Date
}