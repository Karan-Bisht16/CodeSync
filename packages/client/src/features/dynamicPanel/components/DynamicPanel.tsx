import React from 'react';
import { Box, Button, Typography } from '@mui/material';
// importing icons
import { LockOutlined, LoginOutlined } from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing types
import type { ReactNode } from 'react';
// importing features
import { useUserContext } from '../../user';
// importing contexts
import { useAuthContext } from '../../../contexts/Auth.context';
import { usePanelContext } from '../../../contexts/Panel.context';

type DynamicPanelContainerProps = {
    children: ReactNode,
};

const DynamicPanelContainer: React.FC<DynamicPanelContainerProps> = (props) => {
    const { children } = props;

    const { dynamicPanelWidth } = constantsJSON;

    const { dynamicPanel } = usePanelContext();

    return (
        <Box sx={{ bgcolor: 'text.primary' }}>
            <Box
                sx={{
                    display: dynamicPanel ? 'flex' : 'none',
                    height: '100%',
                    width: dynamicPanelWidth,
                    bgcolor: 'background.default',
                    opacity: '0.95',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <>
                    {children}
                </>
            </Box>
        </Box>
    );
};

export const DynamicPanel: React.FC = () => {
    const { dynamicPanel } = usePanelContext();
    const { isLoggedIn } = useUserContext();
    const { openAuthModal } = useAuthContext();

    if (!isLoggedIn) {
        return (
            <DynamicPanelContainer>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                            width: 60,
                            bgcolor: 'action.hover',
                            mb: 3,
                            borderRadius: '50%',
                        }}
                    >
                        <LockOutlined sx={{ fontSize: 28, color: 'primary.main' }} />
                    </Box>
                    <Typography variant='h6' gutterBottom>
                        {dynamicPanel} Locked
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                        Log in to access the multi-file system, system wide search and more.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<LoginOutlined />}
                        onClick={() => openAuthModal('login')}
                        sx={{ borderRadius: 2 }}
                    >
                        Log In
                    </Button>
                </Box>
            </DynamicPanelContainer>
        );
    }

    return (
        <DynamicPanelContainer>
            {dynamicPanel === 'File Explorer' &&
                <Box sx={{ p: 2 }}>
                    <Typography variant='subtitle2'>Files</Typography>
                </Box>
            }
            {dynamicPanel === 'Search' && (
                <Box sx={{ p: 2 }}>
                    <Typography variant='subtitle2'>Search</Typography>
                </Box>
            )}
        </DynamicPanelContainer>
    );
};