import { FormProvider, useForm } from 'react-hook-form';
import { FC, ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export const FormWrapper: FC<Props> = props => {
    const { children } = props;
    const methods = useForm();

    return <FormProvider {...methods}>{children}</FormProvider>;
};
