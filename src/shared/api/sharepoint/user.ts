import { sp } from './base';
import { PermissionKind } from '@pnp/sp/security';
import { User } from './models';

export const getCurrentUser = async (): Promise<User> => {
    const user = await sp.web.currentUser();
    const ManageLists = await sp.web.currentUserHasPermissions(
        PermissionKind.ManageLists
    );
    const EditListItems = await sp.web.currentUserHasPermissions(
        PermissionKind.EditListItems
    );

    const IsSiteAdmin = user.IsSiteAdmin;

    return {
        ...user,
        IsSiteAdmin,
        ManageLists,
        EditListItems,
    };
};
