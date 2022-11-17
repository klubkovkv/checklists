import { Form, useSurveyForm } from 'features/createEditSurvey';
import { Alert, Breadcrumbs, Snackbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Spin from 'shared/ui/spin';

const SurveyCreatePage = () => {
    const {
        formItems,
        isFormItemsLoading,
        isFormItemsEmpty,
        control,
        formState,
        onSubmit,
        handleClose,
        message,
        setMessage,
    } = useSurveyForm();

    const getContent = () => {
        if (isFormItemsLoading) {
            return (
                <div className="container">
                    <Spin />
                </div>
            );
        }
        if (isFormItemsEmpty) {
            return <div className="container">Список пуст</div>;
        }
        return (
            <Form
                form={formItems}
                control={control}
                isEditable={true}
                formState={formState}
                onSubmit={() => onSubmit()}
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

export default SurveyCreatePage;
