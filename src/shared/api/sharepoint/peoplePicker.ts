import { sp } from './base';

export const searchUser = async (query: string) => {
    const searchResult = await sp.profiles.clientPeoplePickerSearchUser({
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        MaximumEntitySuggestions: 25,
        QueryString: query,
    });

    return searchResult.map(user => {
        return { id: user.Key, title: user.DisplayText };
    });
};
