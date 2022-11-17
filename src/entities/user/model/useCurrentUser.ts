import { useEffect } from 'react';

import { useAction, useAppSelector } from 'shared/lib/reduxStd';
import { userModel } from 'entities/user';

export function useCurrentUser() {
    const isLoading = useAppSelector(userModel.selectors.isUserLoading);
    const user = useAppSelector(userModel.selectors.user);
    const fetchUser = useAction(userModel.actions.getCurrentUser);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [fetchUser]);

    return {
        user,
        isLoading,
    };
}
