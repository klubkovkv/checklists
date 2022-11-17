const getEnvVar = (key: string) => {
    if (process.env[key] === undefined) {
        throw new Error(`Env variable ${key} is required`);
    }
    return process.env[key] || '';
};

export const API_URL = getEnvVar('REACT_APP_API_URL');
export const BASE_URL = getEnvVar('REACT_APP_BASE_URL');
export const NODE_ENV = getEnvVar('NODE_ENV');
export const APP_TYPE = getEnvVar('REACT_APP_APP_TYPE');

export const isDevEnv = NODE_ENV === 'development';
export const isProdEnv = NODE_ENV === 'production';

export const QUERY_ROW_LIMIT = 50000;
export const ADMIN_PAGE_URL = getEnvVar('REACT_APP_ADMIN_PAGE_URL');
