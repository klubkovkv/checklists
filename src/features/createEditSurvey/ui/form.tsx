import { FormItem } from 'entities/survey/ui';
import Footer from 'shared/ui/footer';
import Spin from 'shared/ui/spin';
import { Box, Button, Typography } from '@mui/material';
import { Control, FormState } from 'react-hook-form';
import { GroupedFormItem } from 'shared/api/sharepoint/form';

type Props = {
    form: GroupedFormItem[];
    isEditingNeeded?: boolean;
    control: Control;
    handleEdit?: () => void;
    onSubmit: () => void;
    handleClose: () => void;
    isEditable: boolean;
    formState: FormState<Record<string, any>>;
};

export const Form = (props: Props) => {
    const {
        form,
        isEditingNeeded = false,
        control,
        handleEdit,
        onSubmit,
        handleClose,
        isEditable,
        formState,
    } = props;

    return (
        <>
            <div className="container">
                {form.map((item, groupIndex) => (
                    <Box mb={3} key={item.id}>
                        <Typography variant="h2" mb={2}>
                            {groupIndex + 1}. {item.groupTitle}
                        </Typography>
                        {item.fields.map((field, fieldIndex) => (
                            <Box key={field.id} mb={1}>
                                <FormItem
                                    control={control}
                                    {...field}
                                    title={`${groupIndex + 1}.${
                                        fieldIndex + 1
                                    } ${field.title}`}
                                    readonly={!isEditable}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
            </div>
            <Footer>
                {handleEdit && isEditingNeeded && (
                    <Button
                        variant="contained"
                        disabled={isEditable}
                        onClick={() => handleEdit && handleEdit()}
                        sx={{ marginRight: 2 }}>
                        Редактировать
                    </Button>
                )}
                <Button
                    variant="contained"
                    disabled={!isEditable || formState.isSubmitting}
                    onClick={() => onSubmit()}
                    sx={{ marginRight: 2 }}>
                    Сохранить
                    {formState.isSubmitting && (
                        <Spin size={20} sx={{ marginLeft: 1 }} />
                    )}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleClose()}
                    sx={{ marginLeft: 'auto' }}>
                    Закрыть
                </Button>
            </Footer>
        </>
    );
};
