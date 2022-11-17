import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FC } from 'react';
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

export const InputRadioGroup: FC<Props> = props => {
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
                            {label && <FormLabel>{label}</FormLabel>}
                            <RadioGroup onChange={onChange} value={value || ''}>
                                {options.map((option, index) => (
                                    <FormControlLabel
                                        key={`${option.value}_${index}`}
                                        value={option.value}
                                        control={<Radio />}
                                        label={option.text}
                                        disabled={disabled || readonly}
                                    />
                                ))}
                            </RadioGroup>
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
