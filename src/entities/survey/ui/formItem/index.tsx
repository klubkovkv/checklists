import type { FC } from 'react';
import type { Props } from './types';
import {
    InputDate,
    InputSearch,
    InputSelect,
    InputRadioGroup,
    InputText,
} from 'shared/ui';
import { sharepointApi } from 'shared/api';

export const FormItem: FC<Props> = props => {
    const {
        name,
        title,
        type,
        options,
        lookUpOptions,
        defaultValue,
        readonly,
        required,
        control,
    } = props;
    if (type === 'Choice') {
        return (
            <InputSelect
                name={name}
                control={control}
                label={title}
                options={options!}
                defaultValue={defaultValue}
                readonly={readonly}
                required={required}
            />
        );
    }

    if (type === 'Radio') {
        return (
            <InputRadioGroup
                name={name}
                control={control}
                label={title}
                options={options!}
                defaultValue={defaultValue}
                readonly={readonly}
                required={required}
            />
        );
    }

    if (type === 'Lookup') {
        return (
            <InputSelect
                name={name}
                control={control}
                label={title}
                options={lookUpOptions!}
                defaultValue={defaultValue}
                readonly={readonly}
                required={required}
            />
        );
    }

    if (type === 'DateTime') {
        return (
            <InputDate
                name={name}
                control={control}
                label={title}
                defaultValue={defaultValue}
                readonly={readonly}
                required={required}
            />
        );
    }

    if (type === 'Text') {
        return (
            <InputText
                name={name}
                control={control}
                label={title}
                defaultValue={defaultValue}
                readonly={readonly}
                required={required}
            />
        );
    }

    if (type === 'User') {
        return (
            <InputSearch
                name={name}
                control={control}
                label={title}
                defaultValue={defaultValue}
                readonly={readonly}
                onSearch={sharepointApi.peoplePicker.searchUser}
                required={required}
            />
        );
    }

    return <></>;
};
