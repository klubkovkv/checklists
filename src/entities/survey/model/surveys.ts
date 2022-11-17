import {
    createAsyncThunk,
    createSlice,
    createEntityAdapter,
    PayloadAction,
    createSelector,
} from '@reduxjs/toolkit';

import { Survey, sharepointApi, FormItem, Message } from 'shared/api';
import { createBaseSelector } from 'shared/lib/reduxStd';
import {
    CreateSurveysParams,
    ExportSurveysParams,
    UpdateSurveysParams,
} from 'shared/api/sharepoint/surveys';

const surveyAdapter = createEntityAdapter<Survey>({
    selectId: survey => survey.Id,
});

const adapterSelectors = surveyAdapter.getSelectors();

type InitialState = {
    form: FormItem[];
    message: Message | null;
    isFormItemsLoading: boolean;
    isSurveyListLoading: boolean;
    isSurveyDetailsLoading: boolean;
    isSurveysDeleting: boolean;
    isSurveysExporting: boolean;
};

const initialState = surveyAdapter.getInitialState<InitialState>({
    form: [],
    message: null,
    isFormItemsLoading: false,
    isSurveyListLoading: false,
    isSurveyDetailsLoading: false,
    isSurveysDeleting: false,
    isSurveysExporting: false,
});

type State = typeof initialState;

const reducerPath = 'entites/surveys';

const slice = createSlice({
    name: reducerPath,
    initialState,
    reducers: {
        setFormItemsLoading(state, action: PayloadAction<boolean>) {
            state.isFormItemsLoading = action.payload;
        },
        setSurveysListLoading(state, action: PayloadAction<boolean>) {
            state.isSurveyListLoading = action.payload;
        },
        setSurveyDetailsLoading(state, action: PayloadAction<boolean>) {
            state.isSurveyDetailsLoading = action.payload;
        },
        setSurveyDeleting(state, action: PayloadAction<boolean>) {
            state.isSurveysDeleting = action.payload;
        },
        setSurveyExporting(state, action: PayloadAction<boolean>) {
            state.isSurveysExporting = action.payload;
        },
        setMessage(state, action: PayloadAction<Message | null>) {
            state.message = action.payload;
        },
        toggleChecked(state, action: PayloadAction<{ Id: number }>) {
            const { Id } = action.payload;
            const survey = adapterSelectors.selectById(state, Id);
            if (survey) {
                surveyAdapter.updateOne(state, {
                    id: Id,
                    changes: {
                        checked: !survey.checked,
                    },
                });
            }
        },
    },
    extraReducers: build => {
        build.addCase(getForm.fulfilled, (state, action) => {
            state.form = action.payload;
        });
        build.addCase(getList.fulfilled, surveyAdapter.upsertMany);
        build.addCase(getById.fulfilled, surveyAdapter.upsertOne);
        build.addCase(deleteSurveys.fulfilled, surveyAdapter.removeMany);
    },
});

const getForm = createAsyncThunk(
    reducerPath + '/getFormItems',
    (_, { dispatch }) => {
        dispatch(slice.actions.setFormItemsLoading(true));
        return sharepointApi.form.getFormItems().finally(() => {
            dispatch(slice.actions.setFormItemsLoading(false));
        });
    }
);

const createSurvey = createAsyncThunk(
    reducerPath + '/createSurvey',
    (data: CreateSurveysParams, { dispatch }) => {
        try {
            const survey = sharepointApi.surveys.createSurvey(data);
            survey.then(() => {
                dispatch(
                    slice.actions.setMessage({
                        type: 'success',
                        text: 'Чек-лист успешно добавлен!',
                    })
                );
            });
            return survey;
        } catch (error) {
            dispatch(
                slice.actions.setMessage({
                    type: 'error',
                    text: 'Не удалось добавить чек-лист!',
                })
            );
        }
    }
);

const updateSurvey = createAsyncThunk(
    reducerPath + '/updateSurvey',
    (data: UpdateSurveysParams, { dispatch }) => {
        try {
            const updated = sharepointApi.surveys.updateSurveyById(data);
            updated.then(() => {
                dispatch(
                    slice.actions.setMessage({
                        type: 'success',
                        text: 'Чек-лист успешно обновлен!',
                    })
                );
            });

            return updated;
        } catch (error) {
            dispatch(
                slice.actions.setMessage({
                    type: 'error',
                    text: 'Не удалось обновить чек-лист!',
                })
            );
        }
    }
);

const getList = createAsyncThunk(
    reducerPath + '/getList',
    (_, { dispatch }) => {
        dispatch(slice.actions.setSurveysListLoading(true));
        return sharepointApi.surveys.getSurveysList().finally(() => {
            dispatch(slice.actions.setSurveysListLoading(false));
        });
    }
);

const getById = createAsyncThunk(
    reducerPath + '/getById',
    (id: number, { dispatch }) => {
        dispatch(slice.actions.setSurveyDetailsLoading(true));
        return sharepointApi.surveys.getSurveyById(id).finally(() => {
            dispatch(slice.actions.setSurveyDetailsLoading(false));
        });
    }
);

const deleteSurveys = createAsyncThunk(
    reducerPath + '/deleteSurveys',
    (ids: number[], { dispatch }) => {
        dispatch(slice.actions.setSurveyDeleting(true));
        return sharepointApi.surveys
            .deleteSurveyItemsBatch(ids)
            .then(() => ids)
            .finally(() => {
                dispatch(slice.actions.setSurveyDeleting(false));
            });
    }
);

const exportSurveys = createAsyncThunk(
    reducerPath + '/exportSurveys',
    (data: ExportSurveysParams, { dispatch }) => {
        dispatch(slice.actions.setSurveyExporting(true));
        return sharepointApi.surveys.exportSurveyItems(data).finally(() => {
            dispatch(slice.actions.setSurveyExporting(false));
        });
    }
);

const baseSelector = createBaseSelector<State>(reducerPath);

const isFormItemsLoading = createSelector(
    baseSelector,
    state => state.isFormItemsLoading
);

const formItems = createSelector(baseSelector, state => state.form);
const isFormItemsEmpty = createSelector(formItems, l => l.length === 0);

const isListLoading = createSelector(
    baseSelector,
    state => state.isSurveyListLoading
);
const isDetailsLoading = createSelector(
    baseSelector,
    state => state.isSurveyDetailsLoading
);
const isSurveysDeleting = createSelector(
    baseSelector,
    state => state.isSurveysDeleting
);

const isSurveysExporting = createSelector(
    baseSelector,
    state => state.isSurveysExporting
);

const list = createSelector(baseSelector, adapterSelectors.selectAll);
const isListEmpty = createSelector(list, l => l.length === 0);
const checkedItemsIds = createSelector(list, l =>
    l.filter(item => item.checked).map(item => item.Id)
);
const message = createSelector(baseSelector, state => state.message);

const details = createSelector(
    baseSelector,
    (_: unknown, id: number) => id,
    adapterSelectors.selectById
);

export const actions = {
    getForm,
    getList,
    getById,
    createSurvey,
    updateSurvey,
    deleteSurveys,
    exportSurveys,
    setMessage: slice.actions.setMessage,
    toggleChecked: slice.actions.toggleChecked,
};

export const selectors = {
    isFormItemsLoading,
    isListLoading,
    isDetailsLoading,
    isSurveysDeleting,
    isSurveysExporting,
    formItems,
    checkedItemsIds,
    isFormItemsEmpty,
    list,
    isListEmpty,
    details,
    message,
};

export const reducers = {
    [reducerPath]: slice.reducer,
};
