import Checkbox from '@mui/material/Checkbox';
import { useToggleSurvey } from './model';

export type ToggleSurveyProps = {
    surveyId: number;
};

export const ToggleSurvey = ({ surveyId }: ToggleSurveyProps) => {
    const { survey, toggleSurveyChecked } = useToggleSurvey(surveyId);

    if (!survey) return null;

    return (
        <Checkbox
            onClick={() => toggleSurveyChecked(survey)}
            checked={survey.checked}
        />
    );
};
