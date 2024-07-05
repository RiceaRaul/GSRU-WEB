import { FuseNavigationItem } from "@fuse/components/navigation";
import { Urls } from "./urls.const";

export const NAVIGATION_LIST: FuseNavigationItem[] = [
    {
        id   : 'home_group',
        title: 'SIDEBAR.HOME_GROUP_TITLE',
        type : 'basic',
        link: `/${Urls.HOME}`,
        icon: "heroicons_outline:home",
        meta: {
            roles:['user']
        }
    },
    {
        id   : 'calendar_group',
        title: 'Calendar',
        type : 'basic',
        link: `/${Urls.CALENDAR}`,
        icon: "heroicons_outline:calendar-days",
        meta: {
            roles:["user"]
        }
    },
    {
        id   : 'adminsitration_group',
        title: 'Administration',
        type : 'basic',
        link: `/${Urls.ADMIN}`,
        icon: "heroicons_outline:square-3-stack-3d",
        meta: {
            roles:["HR"]
        }
    },
    {
        id   : 'holidays_group',
        title: 'Holidays',
        type : 'basic',
        link: `/${Urls.HOLIDAYS}`,
        icon: "heroicons_outline:briefcase",
        meta: {
            roles:["user"]
        }
    }
];
