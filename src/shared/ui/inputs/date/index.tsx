import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ruLocale from 'date-fns/locale/ru';
import { TextField } from '@mui/material';
import { isValid, getYear } from 'date-fns';

export type TFormInputDate = {
    className?: string;
    label?: string;
    name: string;
    placeholder?: string;
    pastDays?: boolean;
    required?: boolean;
    readonly: boolean;
    shouldUnregister?: boolean;
    defaultValue: string;
    control: Control;
    message?: string;
};

export const InputDate: FC<TFormInputDate> = props => {
    const {
        className = '',
        name,
        label,
        placeholder = 'дд.мм.гггг',
        required = false,
        shouldUnregister = false,
        defaultValue,
        control,
        readonly,
        message = 'Обязательное поле',
    } = props;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message },
                validate: (v: Date) => {
                    if (v === null) {
                        return true;
                    }

                    if (!isValid(new Date(v))) {
                        return 'Укажите правильную дату';
                    }

                    if (getYear(new Date(v)) > 2100) {
                        return 'Дата превышает максимальное значение';
                    }

                    if (getYear(new Date(v)) <= 2000) {
                        return 'Укажите правильную дату';
                    }

                    return isValid(new Date(v));
                },
            }}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}
            render={({
                field: { onChange, value },
                fieldState: { invalid, error },
            }) => {
                return (
                    <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={ruLocale}>
                        <DatePicker
                            className="datePicker__picker"
                            label={label}
                            value={value}
                            onChange={value => {
                                onChange(value);
                            }}
                            disabled={readonly}
                            mask="__.__.____"
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    required={required}
                                    error={invalid || params.error}
                                    fullWidth
                                    size="small"
                                    variant="filled"
                                    helperText={error?.message}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: placeholder,
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                );
            }}
        />
    );
};
