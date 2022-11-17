import styles from './styles.module.scss';
import { FC, ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const Footer: FC<Props> = props => {
    const { children } = props;
    return (
        <footer className={`${styles.footer} footer`}>
            <div className="container">{children}</div>
        </footer>
    );
};

export default Footer;
