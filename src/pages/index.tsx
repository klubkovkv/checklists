import { Route, Routes } from 'react-router-dom';
import SurveysListPage from './surveysList';
import SurveyDetailsPage from './surveyDetails';
import SurveyCreatePage from './surveyCreate';

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<SurveysListPage />} />
            <Route path="/survey/:surveyId" element={<SurveyDetailsPage />} />
            <Route path="/survey/create" element={<SurveyCreatePage />} />
        </Routes>
    );
};
