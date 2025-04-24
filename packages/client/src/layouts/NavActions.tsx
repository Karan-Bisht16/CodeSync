import React from 'react';
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
// importing components
import { ToolTip } from '../components/ToolTip';
import { useMobileContext } from '../contexts/Mobile.context';
import { useLocation, useNavigate } from 'react-router-dom';

export const NavActions: React.FC = () => {
    const { isMobile } = useMobileContext();
    const { settingsModal, openSettingsModal, closeSettingsModal } = useSettingsContext();
    const { isLoggedIn } = useUserContext();

    const location = useLocation();

    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            {(!isLoggedIn && !(isMobile && location.pathname.startsWith('/editor/'))) &&
                <>
                    <Button
                        size='small'
                        onClick={() => navigate('/auth')}
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
                        onClick={() => navigate('/auth')}
                        sx={{ borderRadius: '4px' }}
                    >
                        Sign Up
                    </Button>
                </>
            }

            <ToolTip title='Settings (Ctrl + ,)'>
                <IconButton onClick={openSettingsModal}>
                    <SettingsIcon />
                </IconButton>
            </ToolTip>

            <Settings open={settingsModal} onClose={closeSettingsModal} />
        </Box>
    );
};