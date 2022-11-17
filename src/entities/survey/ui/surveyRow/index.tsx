import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Survey } from 'shared/api';
import ListItem from '@mui/material/ListItem';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import IconButton from '@mui/material/IconButton';

import styles from './styles.module.scss';

export type SurveyRowProps = PropsWithChildren<{
    data: Survey;
    titleHref: string;
    before?: ReactNode;
    after?: ReactNode;
}>;

export const SurveyRow = ({
    data,
    before,
    after,
    titleHref,
}: SurveyRowProps) => {
    return (
        <ListItem className={styles.listItem}>
            {before}
            <Link to={titleHref} className={styles.title}>
                {data.Title}
            </Link>
            {after}
            <Link to={titleHref}>
                <IconButton edge="end">
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Link>
        </ListItem>
    );
};
