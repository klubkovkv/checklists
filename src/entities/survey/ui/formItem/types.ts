import type { FormItem } from 'shared/api';
import type { Control } from 'react-hook-form';

export type Props = FormItem & { control: Control } & { readonly: boolean };
