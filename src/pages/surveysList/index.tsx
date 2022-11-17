import List from '@mui/material/List';
import { Link } from 'react-router-dom';
import { SurveyRow } from 'entities/survey';
import { ToggleSurvey } from 'features/toggleSurvey';
import * as surveyListPageModel from './model';
import { Box, Button, Typography } from '@mui/material';
import Spin from 'shared/ui/spin';
import { ADMIN_PAGE_URL } from 'shared/config';
import Footer from 'shared/ui/footer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import IconButton from '@mui/material/IconButton';
import { useCurrentUser } from 'entities/user/model';
import { checkListType } from 'shared/api/sharepoint/const';

const goToAdminPage = () => window.open(ADMIN_PAGE_URL, '_blank');

const SurveysListPage = () => {
    const { user, isLoading: userIsLoading } = useCurrentUser();

    const {
        isLoading,
        surveys,
        checkedSurveysIds,
        onDelete,
        isDeleting,
        isExporting,
        onExport,
        openAsPDF,
    } = surveyListPageModel.useSurveysList();

    if (isLoading || userIsLoading) {
        return <Spin />;
    }

    return (
        <>
            <div className="container">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={3}>
                    <Typography variant="h1">
                        {`Чек-листы ${checkListType}`}
                    </Typography>
                    <Box>
                        {user?.ManageLists && (
                            <Button
                                onClick={() => goToAdminPage()}
                                variant="contained"
                                sx={{ marginRight: 2 }}>
                                Администрирование
                            </Button>
                        )}
                        <Button
                            component={Link}
                            to="/survey/create"
                            variant="contained">
                            Заполнить чек-лист
                        </Button>
                    </Box>
                </Box>
                <List
                    sx={{
                        width: '100%',
                    }}>
                    {surveys.map(survey => (
                        <SurveyRow
                            key={survey.Id}
                            data={survey}
                            titleHref={`/survey/${survey.Id}`}
                            before={<ToggleSurvey surveyId={survey.Id} />}
                            after={
                                <IconButton
                                    edge="end"
                                    sx={{ marginRight: 1 }}
                                    onClick={() => openAsPDF(survey.Id)}>
                                    <PictureAsPdfIcon />
                                </IconButton>
                            }
                        />
                    ))}
                </List>
            </div>
            <Footer>
                {user?.ManageLists && (
                    <Button
                        variant="contained"
                        disabled={isDeleting || checkedSurveysIds.length === 0}
                        onClick={() => onDelete()}
                        sx={{ marginRight: 2 }}>
                        Удалить
                        {isDeleting && (
                            <Spin size={20} sx={{ marginLeft: 1 }} />
                        )}
                    </Button>
                )}
                <Button
                    variant="contained"
                    disabled={isExporting || checkedSurveysIds.length === 0}
                    onClick={() => onExport()}
                    sx={{ marginRight: 2 }}>
                    Экспорт в Excel
                    {isExporting && <Spin size={20} sx={{ marginLeft: 1 }} />}
                </Button>
            </Footer>
        </>
    );
};

export default SurveysListPage;
