import Utils from "./utils";

export default class PayloadUtils {
    static ComputeLoginPayload(username: string, password: string): any {
        return {
            username: username,
            password: password
        };
    }

    static ComputeCreateTaskPayload(title: string, description: string, parentId: number, reporter: number, estimateTime: string, storyPoints: number, taskType: number, taskStatus: number, priority: number, teamId: number, sprintId: number): any {

        return {
            title: title,
            description: description,
            parentId: parentId,
            reporter: reporter,
            estimateTime: Utils.parseDuration(estimateTime),
            storyPoints: storyPoints,
            taskType: taskType,
            taskStatus: taskStatus,
            priority: priority,
            teamId: teamId,
            sprintId: sprintId
        };
    }

    static ComputeLogTimePayload(taskId: number, startDate: string, endDate: string, comment: string): any {
        return {
            taskId: taskId,
            startDate: startDate,
            endDate: endDate,
            description: comment
        };
    }
}
