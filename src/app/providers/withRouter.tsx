import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BASE_URL } from 'shared/config';

export const withRouter = (component: () => ReactNode) => () =>
    <BrowserRouter basename={BASE_URL}>{component()}</BrowserRouter>;
