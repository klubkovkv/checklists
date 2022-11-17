import { configureStore } from '@reduxjs/toolkit';

import { userModel } from 'entities/user';
import { surveyModel } from 'entities/survey';

export const store = configureStore({
    reducer: {
        ...userModel.reducers,
        ...surveyModel.reducers,
    },
});
