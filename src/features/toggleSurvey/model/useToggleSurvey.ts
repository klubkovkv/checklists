import { surveyModel } from 'entities/survey';
import { useAppSelector, useAction } from 'shared/lib/reduxStd';

export function useToggleSurvey(Id: number) {
    const survey = useAppSelector(state =>
        surveyModel.selectors.details(state, Id)
    );
    const toggleSurveyChecked = useAction(surveyModel.actions.toggleChecked);

    return { survey, toggleSurveyChecked };
}
