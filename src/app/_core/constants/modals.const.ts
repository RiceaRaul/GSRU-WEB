export enum Modals {
    CREATE_TASK_DIALOG,
    START_SPRINT_DIALOG,
    WORKLOG_DIALOG,
    FILE_UPLOAD_DIALOG,
    LOG_TIME_DIALOG,
    CLOSE_SPRINT_DIALOG,
    UPDATE_EMPLOYEE_DIALOG,
    ADD_EMPLOYEE_DIALOG,
    MANAGE_EMP_TEAMS_DIALOG,
    ADD_HOLIDAYS_DIALOG,
    ADD_TEAM_DIALOG,
}

export const MODALS_STYLES = [
    {
        name: Modals.CREATE_TASK_DIALOG,
        style: {
            autoFocus: false
        }
    },
    {
        name: Modals.START_SPRINT_DIALOG,
        style: {
            autoFocus: false,
            width: '30vw'
        }
    },
    {
        name: Modals.WORKLOG_DIALOG,
        style: {
            autoFocus: false,
            width: '90vw',
        }
    },

    {
        name: Modals.FILE_UPLOAD_DIALOG,
        style: {
            autoFocus: false,
            width: '30vw'
        }
    },
    {
        name: Modals.LOG_TIME_DIALOG,
        style: {
            autoFocus: false,
            width: '30vw'
        }
    },
    {
        name: Modals.CLOSE_SPRINT_DIALOG,
        style: {
            autoFocus: false,
        }
    },

    {
        name: Modals.UPDATE_EMPLOYEE_DIALOG,
        style: {
            autoFocus: false,
        }
    },

    {
        name: Modals.ADD_EMPLOYEE_DIALOG,
        style: {
            autoFocus: false,
            width: '90vw',
            height: '80vh'
        }
    },
    {
        name: Modals.MANAGE_EMP_TEAMS_DIALOG,
        style: {
            autoFocus: false
        }
    },
    {
        name: Modals.ADD_HOLIDAYS_DIALOG,
        style: {
            autoFocus: false,
            width: '30vw',
        }
    },
    {
        name: Modals.ADD_TEAM_DIALOG,
        style: {
            autoFocus: false,
            width: '30vw',
        }
    }
]

export enum MODAL_ACTIONS {
//EXAMPLE:
// DELETE_DATA_CONFIRM
}

export enum MODAL_RESPONSE {
    CLOSE = 'close',
    CLOSE_ALL = 'closeAll',
    CLOSE_SUCCESS = 'closeSuccess'
}
