import { useEffect } from 'react';

import { useAction, useAppSelector } from 'shared/lib/reduxStd';
import { surveyModel } from 'entities/survey';

export function useSurveyDetails(surveyId: number) {
    const isLoading = useAppSelector(surveyModel.selectors.isDetailsLoading);
    const survey = useAppSelector(state =>
        surveyModel.selectors.details(state, surveyId)
    );
    const fetchSurvey = useAction(surveyModel.actions.getById);

    useEffect(() => {
        fetchSurvey(surveyId);
    }, [fetchSurvey, surveyId]);

    return {
        survey,
        isLoading,
    };
}
