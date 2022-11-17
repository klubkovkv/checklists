import { ReactComponent as Logo } from './logo.svg';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={`${styles.header} header`}>
            <div className={`${styles.container} container`}>
                <Link className={styles.logoLink} to="/">
                    <Logo className={styles.logoSvg} />
                </Link>
            </div>
        </header>
    );
};

export default Header;
