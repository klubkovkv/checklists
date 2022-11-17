import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

type Props = {
    className?: string;
    name: string;
    label: string;
    readonly?: boolean;
    disabled?: boolean;
    required?: boolean;
    shouldUnregister?: boolean;
    multiple?: boolean;
    defaultValue?: any;
    multiline?: boolean;
    control: Control;
    placeholder?: string;
    message?: string;
};

export const InputText: FC<Props> = props => {
    const {
        className = '',
        name,
        label,
        disabled = false,
        required = false,
        readonly = false,
        shouldUnregister = false,
        multiline = false,
        defaultValue,
        control,
        placeholder = '',
        message = 'Обязательное поле',
    } = props;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: {
                    value: required,
                    message,
                },
            }}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}
            render={({
                field: { onChange, value },
                fieldState: { invalid, error },
            }) => {
                return (
                    <TextField
                        required={required}
                        error={invalid}
                        helperText={error?.message}
                        variant="filled"
                        fullWidth
                        className={className}
                        onChange={onChange}
                        value={value}
                        label={label}
                        multiline={multiline}
                        disabled={disabled || readonly}
                        placeholder={placeholder}
                    />
                );
            }}
        />
    );
};
