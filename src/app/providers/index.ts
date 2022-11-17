import compose from 'compose-function';
import { withRouter } from './withRouter';
import { withStore } from './withStore';
import { withMui } from './withMui';

export const withProviders = compose(withStore, withMui, withRouter);
