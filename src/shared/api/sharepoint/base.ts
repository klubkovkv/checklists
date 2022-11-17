import { SPBrowser, spfi } from '@pnp/sp';
import '@pnp/sp/presets/all';
import '@pnp/sp/batching';
import '@pnp/sp/items/get-all';
import { API_URL } from 'shared/config';

export const sp = spfi().using(SPBrowser({ baseUrl: API_URL }));
