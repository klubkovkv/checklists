import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    createSelector,
} from '@reduxjs/toolkit';

import { User, sharepointApi } from 'shared/api';
import { createBaseSelector } from 'shared/lib/reduxStd';

type InitialState = {
    user: User | null;
    isUserLoading: boolean;
};

const initialState: InitialState = {
    user: null,
    isUserLoading: false,
};

type State = typeof initialState;

const reducerPath = 'entites/user';

const slice = createSlice({
    name: reducerPath,
    initialState,
    reducers: {
        setUserLoading(state, action: PayloadAction<boolean>) {
            state.isUserLoading = action.payload;
        },
    },
    extraReducers: build => {
        build.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    },
});

const getCurrentUser = createAsyncThunk(
    reducerPath + '/getCurrentUser',
    (_, { dispatch }) => {
        dispatch(slice.actions.setUserLoading(true));
        return sharepointApi.user.getCurrentUser().finally(() => {
            dispatch(slice.actions.setUserLoading(false));
        });
    }
);

const baseSelector = createBaseSelector<State>(reducerPath);

const user = createSelector(baseSelector, state => state.user);

const isUserLoading = createSelector(
    baseSelector,
    state => state.isUserLoading
);

export const actions = {
    getCurrentUser,
};

export const selectors = {
    user,
    isUserLoading,
};

export const reducers = {
    [reducerPath]: slice.reducer,
};
