import { useEffect } from 'react';
import { useAction, useAppSelector } from 'shared/lib/reduxStd';
import { surveyModel } from 'entities/survey';
import { sharepointApi } from 'shared/api';

export function useSurveysList() {
    const isListLoading = useAppSelector(surveyModel.selectors.isListLoading);
    const isListEmpty = useAppSelector(surveyModel.selectors.isListEmpty);
    const isDeleting = useAppSelector(surveyModel.selectors.isSurveysDeleting);
    const isExporting = useAppSelector(
        surveyModel.selectors.isSurveysExporting
    );
    const fetchList = useAction(surveyModel.actions.getList);
    const deleteSurveys = useAction(surveyModel.actions.deleteSurveys);
    const exportSurveys = useAction(surveyModel.actions.exportSurveys);
    const surveys = useAppSelector(surveyModel.selectors.list);
    const checkedSurveysIds = useAppSelector(
        surveyModel.selectors.checkedItemsIds
    );
    const fetchForm = useAction(surveyModel.actions.getForm);
    const formItems = useAppSelector(surveyModel.selectors.formItems);
    const isFormItemsLoading = useAppSelector(
        surveyModel.selectors.isFormItemsLoading
    );
    const isFormItemsEmpty = useAppSelector(
        surveyModel.selectors.isFormItemsEmpty
    );
    useEffect(() => {
        if (isListEmpty || surveys.length <= 1) {
            fetchList();
        }
        if (isFormItemsEmpty) {
            fetchForm();
        }
    }, [fetchList, isFormItemsEmpty, isListEmpty]);

    const onDelete = () => {
        deleteSurveys(checkedSurveysIds);
    };

    const onExport = () => {
        exportSurveys({ fields: formItems, ids: checkedSurveysIds });
    };

    const openAsPDF = (id: number) =>
        sharepointApi.surveys.openAsPDF({ fields: formItems, id });

    const isLoading = isFormItemsLoading || isListLoading;

    const isEmpty = isFormItemsEmpty || isListEmpty;

    return {
        isLoading,
        isEmpty,
        isDeleting,
        isExporting,
        surveys,
        checkedSurveysIds,
        onDelete,
        onExport,
        openAsPDF,
    };
}
