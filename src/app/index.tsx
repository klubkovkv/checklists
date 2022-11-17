import { withProviders } from './providers';
import { Routing } from 'pages';
import { Header } from 'widgets/header';

import './index.scss';

const App = () => {
    return (
        <div className="app">
            <Header />
            <main className="content">
                <Routing />
            </main>
        </div>
    );
};

export default withProviders(App);
