export interface Task{
    id: number;
    name: string;
    description: string;
    parentId: number;
    reporter: string;
    estimateTime: number;
    remainingTime: number;
    storyPoints: number;
    taskType: string;
    taskStatus: string;
    priority: string;
    children: Task[];
    index: number;
    sprintId: number;
    taskAttachments: TaskAttachment[];
    taskComments: TaskComment[];
    taskAssignees: TaskAssignee[];
}

export interface TaskAttachment{
    id: number;
    taskId: number;
    fileName: string;
    filePath: string;
    author: string;
    authorName: string;
}

export interface TaskComment{
    id: number;
    taskId: number;
    comment: string;
    author: string;
    authorName: string;
}

export interface TaskAssignee{
    id: number;
    taskId: number;
    employeeId: number;
    employeeName: string;
}

export interface TaskTypeStatus{
    id: number;
    name: string;
}

export interface TaskTypeStatusResponse{
    result: TaskTypeStatus[];
}

export interface AssignEmployeeToTaskRequest{
    taskId: number;
    employeeId?: number;
}

export interface AddTaskCommentRequest{
    taskId: number;
    employeeId?: number;
    comment: string;
}

export interface GetWorklogsByEmployeeId
{
    id: number;
    employeeTeamsId: number;
    taskId: number;
    startTime: Date;
    endTime: Date;
    description: string;
    taskName: string;
}

