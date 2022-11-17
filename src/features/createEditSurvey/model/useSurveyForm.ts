import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAction, useAppSelector } from 'shared/lib/reduxStd';
import { surveyModel } from 'entities/survey';
import { useNavigate } from 'react-router-dom';
import { groupFormItemsByCategory } from 'shared/api/sharepoint/form';

export function useSurveyForm(surveyId?: number, values?: any) {
    const isFormItemsLoading = useAppSelector(
        surveyModel.selectors.isFormItemsLoading
    );
    const isFormItemsEmpty = useAppSelector(
        surveyModel.selectors.isFormItemsEmpty
    );

    const fetchForm = useAction(surveyModel.actions.getForm);
    const updateSurvey = useAction(surveyModel.actions.updateSurvey);
    const createSurvey = useAction(surveyModel.actions.createSurvey);
    const formItems = useAppSelector(surveyModel.selectors.formItems);
    const message = useAppSelector(surveyModel.selectors.message);
    const setMessage = useAction(surveyModel.actions.setMessage);

    const [isEditable, setIsEditable] = useState(false);

    const navigate = useNavigate();

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleClose = () => {
        navigate('/');
    };

    useEffect(() => {
        if (isFormItemsEmpty) {
            fetchForm();
        }
        return () => setMessage(null);
    }, [fetchForm, isFormItemsEmpty]);

    const groupedFormItems = useMemo(
        () => groupFormItemsByCategory(formItems),
        [formItems]
    );

    const methods = useForm({ mode: 'onChange' });
    const { handleSubmit, control, reset, formState } = methods;

    useEffect(() => {
        reset(values);
    }, [reset, values]);

    const onSubmit = () => {
        if (surveyId) {
            handleSubmit(
                properties =>
                    updateSurvey({
                        surveyId,
                        fields: formItems,
                        properties,
                    }).then(() => setIsEditable(false)),
                () => setMessage({ type: 'error', text: 'Заполните все поля!' })
            )();

            return;
        }
        handleSubmit(
            properties =>
                createSurvey({ fields: formItems, properties }).then(() =>
                    reset()
                ),
            () => setMessage({ type: 'error', text: 'Заполните все поля!' })
        )();
    };

    return {
        isFormItemsLoading,
        isFormItemsEmpty,
        formItems: groupedFormItems,
        formState,
        control,
        handleEdit,
        isEditable,
        onSubmit,
        handleClose,
        message,
        setMessage,
    };
}
