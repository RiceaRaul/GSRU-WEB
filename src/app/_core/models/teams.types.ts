export interface Team {
    id: number
    name: string
    teamLeadId: number
}

export interface TeamMember {
    id:number,
    firstName: string,
    lastName: string,
    role: string,
    isLeader: boolean,
}

export interface TeamMemberOverview {
    teamMembers: TeamMember[]
}