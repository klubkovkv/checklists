import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FC } from 'react';
import { SxProps, Theme } from '@mui/material';

type Props = {
    size?: number;
    sx?: SxProps<Theme>;
};

const Spin: FC<Props> = ({ size = 40, sx }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: 'auto',
            }}>
            <CircularProgress sx={sx} size={size} />
        </Box>
    );
};

export default Spin;
