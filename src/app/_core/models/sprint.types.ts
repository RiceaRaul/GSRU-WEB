import { Task } from "./task.types";

export interface Sprint{
    id: number;
    number: number;
    sprintGoal?: string;
    startDate?: string;
    endDate?:string
    collapsed?: boolean;
    tasks?: Task[];
}

export interface Backlog{
    sprints: Sprint[];
}