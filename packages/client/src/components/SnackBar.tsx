import React from 'react';
import {
    Alert,
    Snackbar
} from '@mui/material';
// importing data
import { constantsJSON } from '../data/constants.data';
// importing types
import type { SnackBarProps } from '../types/SnackBar.types';
// importing contexts
import { useMobileContext } from '../contexts/Mobile.context';

export const SnackBar: React.FC<SnackBarProps> = (props: SnackBarProps) => {
    const { openSnackBar, timeOut, handleClose, snackBarData, sx } = props;
    const { status, message } = snackBarData;

    const { transitionDuration } = constantsJSON;

    const { isMobile } = useMobileContext();

    return (
        <Snackbar
            open={openSnackBar}
            autoHideDuration={timeOut}
            onClose={handleClose}
            anchorOrigin={{
                vertical: isMobile ? 'top' : 'bottom',
                horizontal: 'right'
            }}
            sx={sx}
            transitionDuration={transitionDuration}
        >
            <Alert
                onClose={handleClose}
                severity={status}
                variant='filled'
                sx={{ color: 'white' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};