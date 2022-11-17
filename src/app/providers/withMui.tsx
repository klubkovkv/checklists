import { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: ['Geometria', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontSize: 28,
            fontWeight: 700,
        },
        h2: {
            fontSize: 20,
            fontWeight: 500,
        },
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '.MuiCircularProgress-root': {
                        position: 'relative',
                        top: '-8px',
                    },
                    '.MuiFilledInput-root': {
                        paddingTop: '10px',
                        paddingBottom: '10px',
                    },
                    '.MuiFilledInput-root .MuiFilledInput-input': {
                        paddingTop: '0px',
                        paddingBottom: '0px',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                filled: {
                    paddingTop: '10px',
                    paddingBottom: '10px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '.MuiFilledInput-input': {
                        paddingTop: '10px',
                        paddingBottom: '10px',
                    },
                    '.MuiFilledInput-root.MuiInputBase-multiline': {
                        paddingTop: '0px',
                        paddingBottom: '0px',
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '.MuiFormLabel-root': {
                        position: 'unset',
                        transform: 'unset',
                    },
                },
            },
        },
    },
});

export const withMui = (component: () => ReactNode) => () =>
    <ThemeProvider theme={theme}>{component()}</ThemeProvider>;
