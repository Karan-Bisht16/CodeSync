import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
} from '@mui/material';
// importing icons
import {
    Logout as LogoutIcon,
    Person as ProfileIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
// importing features
import { AuthModal, useAuthContext } from '../features/auth';
import { Settings, useSettingsContext } from '../features/settings';
import { useUserContext } from '../features/user';
// importing contexts
import { useMobileContext } from '../contexts/Mobile.context';
// importing components
import { ToolTip } from '../components/ToolTip';
import { linkTo } from '../utils/helpers.util';

export const NavActions: React.FC = () => {
    const { openAuthModal, logout } = useAuthContext();
    const { isMobile } = useMobileContext();
    const { openSettingsModal } = useSettingsContext();
    const { isLoggedIn, user } = useUserContext();

    const location = useLocation();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        if (location.pathname.startsWith('/editor/')) {
            linkTo(`${window.location.origin}/profile`);
        } else {
            navigate('/profile');
        }
        handleClose();
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/');
    };

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

            {isLoggedIn &&
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        <ToolTip title='Account settings'>
                            <IconButton
                                onClick={handleOpen}
                                size='small'
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ height: 32, width: 32, color: 'primary.contrastText', bgcolor: 'primary.main' }}>
                                    {user.username.charAt(0)}
                                </Avatar>
                            </IconButton>
                        </ToolTip>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id='account-menu'
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: `''`,
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        disableScrollLock={true}
                    >
                        <MenuItem onClick={handleProfile}>
                            <ListItemIcon>
                                <ProfileIcon fontSize='small' />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize='small' />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
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