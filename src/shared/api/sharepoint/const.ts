import { APP_TYPE } from 'shared/config';

console.log('APP_TYPE', APP_TYPE);

export const lists = {
    settings: `/depts/TechSafety/npot/Lists/${APP_TYPE}ChecklistSettings`,
    checkLists: `/depts/TechSafety/npot/Lists/${APP_TYPE}${
        APP_TYPE === 'atp' ? 'Checklist' : 'checklist'
    }`,
};

export const checkListType = APP_TYPE === 'rc' ? `РЦ` : 'АТП';
