import { ISiteUserInfo } from '@pnp/sp/site-users';

export type User = ISiteUserInfo & {
    ManageLists: boolean;
    EditListItems: boolean;
};

export type Survey = {
    Id: number;
    Title: string;
    data: any;
    checked: boolean;
};

export type FieldSettings = {
    Id: number;
    Title: string;
    position: number;
    group: Group;
};

type Group = {
    Id: number;
    Title: string;
    position: number;
};

type FieldTypes = 'Lookup' | 'DateTime' | 'User' | 'Choice' | 'Radio' | 'Text';

export type Message = { type: 'success' | 'error'; text: string };

export type FormItem = {
    id: string;
    name: string;
    title: string;
    type: FieldTypes;
    required: boolean;
    position: number | null;
    defaultValue: any;
    group: Group;
    lookUpOptions:
        | {
              value: number;
              text: string;
          }[]
        | null;
    options:
        | {
              value: string;
              text: string;
          }[]
        | null;
};

export type SPField = {
    Id: string;
    InternalName: string;
    Title: string;
    Required: boolean;
    TypeAsString: FieldTypes;
    EditFormat?: number;
    Choices: string[];
    LookupField?: string;
    LookupList?: string;
};
