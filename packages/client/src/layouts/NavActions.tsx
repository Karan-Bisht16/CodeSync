import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    IconButton
} from '@mui/material';
// importing icons
import {
    Settings as SettingsIcon,
} from '@mui/icons-material';
// importing features
import { Settings, useSettingsContext } from '../features/settings';
import { useUserContext } from '../features/user';
// importing contexts
import { useAuthContext } from '../contexts/Auth.context';
import { useMobileContext } from '../contexts/Mobile.context';
// importing components
import { ToolTip } from '../components/ToolTip';
import { AuthModal } from '../components/AuthModal';

export const NavActions: React.FC = () => {
    const { openAuthModal } = useAuthContext();
    const { isMobile } = useMobileContext();
    const { openSettingsModal } = useSettingsContext();
    const { isLoggedIn } = useUserContext();

    const location = useLocation();


    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            {(!isLoggedIn && !(isMobile && location.pathname.startsWith('/editor/'))) &&
                <>
                    <Button
                        size='small'
                        onClick={() => openAuthModal('login')}
                        sx={{
                            color: 'text.primary',
                            px: '16px',
                            border: '0.5px solid',
                            borderRadius: '4px',
                            borderColor: 'text.secondary',
                        }}
                    >
                        Log In
                    </Button>
                    <Button
                        size='small'
                        variant='contained'
                        color='primary'
                        onClick={() => openAuthModal('register')}
                        sx={{ borderRadius: '4px' }}
                    >
                        Register
                    </Button>
                </>
            }

            <ToolTip title='Settings (Ctrl + ,)'>
                <IconButton size='small' onClick={openSettingsModal}>
                    <SettingsIcon fontSize='small' />
                </IconButton>
            </ToolTip>

            <Settings />
            <AuthModal />
        </Box>
    );
};