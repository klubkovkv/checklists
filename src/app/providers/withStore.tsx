import { store } from 'app/store';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';

export const withStore = (component: () => ReactNode) => () =>
    <Provider store={store}>{component()}</Provider>;
