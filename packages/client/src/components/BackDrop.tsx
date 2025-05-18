import React from 'react';
import { Box } from '@mui/material';
// imorting types
import type { ReactNode } from 'react';
// imorting hooks
import { useNoScroll } from '../hooks/useNoScroll';

type BackDropProps = {
    children: ReactNode,
};

export const BackDrop: React.FC<BackDropProps> = (props) => {
    const { children } = props;
    useNoScroll();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                bgcolor: 'rgba(0, 0, 0, 0.9)',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </Box>
        </Box>
    );
};