import { Form, useSurveyForm } from 'features/createEditSurvey';
import { Alert, Breadcrumbs, Snackbar, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useSurveyDetails } from './model';
import Spin from 'shared/ui/spin';
import { useCurrentUser } from 'entities/user/model';

const SurveyDetailsPage = () => {
    const params = useParams();
    const surveyId = Number(params?.surveyId);
    const { user, isLoading: userIsLoading } = useCurrentUser();
    const { survey, isLoading: surveyIsLoading } = useSurveyDetails(surveyId);

    const {
        formItems,
        isFormItemsEmpty,
        isFormItemsLoading,
        formState,
        control,
        handleEdit,
        isEditable,
        onSubmit,
        handleClose,
        message,
        setMessage,
    } = useSurveyForm(surveyId, survey?.data);

    const getContent = () => {
        if (userIsLoading || isFormItemsLoading || surveyIsLoading) {
            return (
                <div className="container">
                    <Spin />
                </div>
            );
        }

        if (isFormItemsEmpty || !user) {
            return <div className="container">Список пуст</div>;
        }

        return (
            <Form
                isEditingNeeded={true}
                form={formItems}
                control={control}
                isEditable={isEditable}
                handleEdit={user!.EditListItems ? handleEdit : undefined}
                onSubmit={onSubmit}
                formState={formState}
                handleClose={handleClose}
            />
        );
    };

    return (
        <>
            <div className="container">
                <Breadcrumbs sx={{ marginBottom: 2 }}>
                    <Link to="/">
                        <Typography variant="h1">Список</Typography>
                    </Link>
                    <Typography variant="h1">Чек-лист</Typography>
                </Breadcrumbs>
            </div>
            {getContent()}
            {message && (
                <Snackbar
                    open={!!message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{ bottom: { sm: 90 } }}
                    autoHideDuration={5000}
                    onClose={() => setMessage(null)}>
                    <Alert
                        onClose={() => setMessage(null)}
                        severity={message?.type}
                        sx={{ width: '100%' }}>
                        {message?.text}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};

export default SurveyDetailsPage;
