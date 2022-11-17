import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Control, Controller } from 'react-hook-form';
import { FC, useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

type Props = {
    className?: string;
    name: string;
    label: string;
    readOnly?: boolean;
    disabled?: boolean;
    required?: boolean;
    shouldUnregister?: boolean;
    multiple?: boolean;
    defaultValue?: any;
    control: Control;
    onSearch: (query: string) => Promise<any[]>;
    readonly: boolean;
};

export const InputSearch: FC<Props> = props => {
    const {
        className = '',
        name,
        label,
        disabled = false,
        required = false,
        readonly,
        shouldUnregister = false,
        defaultValue,
        control,
        onSearch,
    } = props;
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedGetOptions = useCallback(
        debounce((queryString: string) => {
            if (queryString) {
                setLoading(true);
                onSearch(queryString).then(result => {
                    setOptions(result);
                    setLoading(false);
                });
            } else {
                setOptions([]);
            }
        }, 300),
        []
    );

    const updateValue = (newValue: string) => {
        setInputValue(newValue);
        debouncedGetOptions(newValue);
    };

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
                        <Autocomplete
                            fullWidth
                            open={open}
                            size={'small'}
                            disabled={readonly}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            isOptionEqualToValue={(option, value) => {
                                return option.id === value.id;
                            }}
                            value={value}
                            getOptionLabel={option => option.title}
                            options={options}
                            loading={loading}
                            onChange={(event, newValue) => {
                                console.log(newValue);
                                if (newValue) {
                                    onChange({
                                        id: newValue.id,
                                        title: newValue.title,
                                    });
                                } else {
                                    onChange(newValue);
                                }
                            }}
                            onInputChange={(event, newInputValue) => {
                                updateValue(newInputValue);
                            }}
                            noOptionsText={'Нет данных'}
                            loadingText={'Загрузка...'}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={label}
                                    variant="filled"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </div>
                );
            }}
        />
    );
};
