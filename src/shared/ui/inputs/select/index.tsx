import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FC, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

type Props = {
    className?: string;
    name: string;
    label: string;
    readonly?: boolean;
    options: {
        value: string | number;
        text: string;
    }[];
    disabled?: boolean;
    required?: boolean;
    shouldUnregister?: boolean;
    multiple?: boolean;
    defaultValue?: any;
    control: Control;
};

export const InputSelect: FC<Props> = props => {
    const {
        className = '',
        name,
        options,
        label,
        disabled = false,
        required = false,
        readonly = false,
        shouldUnregister = false,
        defaultValue,
        control,
    } = props;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: {
                    value: required,
                    message: '',
                },
            }}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}
            render={({
                field: { onChange, value },
                fieldState: { invalid, error },
            }) => {
                return (
                    <div className={className}>
                        <FormControl
                            required={required}
                            variant="filled"
                            sx={{
                                m: 1,
                                minWidth: 200,
                                width: '100%',
                                margin: 0,
                            }}
                            size="small"
                            error={invalid}>
                            {label && <InputLabel>{label}</InputLabel>}
                            <Select
                                onChange={onChange}
                                value={value || ''}
                                disabled={disabled || readonly}
                                displayEmpty>
                                {options.map((option, index) => (
                                    <MenuItem
                                        key={`${option.value}_${index}`}
                                        value={option.value}>
                                        {option.text}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error?.message && (
                                <FormHelperText>
                                    {error?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </div>
                );
            }}
        />
    );
};
