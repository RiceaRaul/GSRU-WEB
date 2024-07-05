import { Team } from "./teams.types"

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    serieNr: string;
    birthDate: string;
    email: string;
    phoneNumber: string;
    hireDate: string;
    totalLeaves: number;
    remainingLeaves: number;
    workHours: number;
    address1: string;
    address2: string;
    salary: number;
    managerId:number;
    teams: Team[];
    roles: string[];
}

