import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
// importing icons
import {
    Close as CloseIcon,
    RestartAlt as ResetIcon,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing contexts
import { useMobileContext } from '../../../contexts/Mobile.context';
import { useModalContext } from '../../../contexts/Modal.context';
import { useSettingsContext } from '../contexts/Settings.context';
// importing hooks
import { useSettingsSections } from '../hooks/useSettingsSection';
// importing components
import { BackDrop } from '../../../components/BackDrop';
import { AppearanceSettings } from './AppearanceSettings';
import { EditorSettings } from './EditorSettings';
import { KeyBindingSettings } from './KeyBindingSettings';
import { NotificationSettings } from './NotificationSettings';
import { UserSettings } from './UserSettings';

type SettingsProps = {
    open: boolean,
    onClose: () => void,
};

export const Settings: React.FC<SettingsProps> = ({ open, onClose }) => {
    const { settingsSidebarWidth } = constantsJSON;

    const { isMobile } = useMobileContext();
    const { openModal } = useModalContext();
    const { resetSettings } = useSettingsContext();
    const { sections, activeSection, handleSectionChange } = useSettingsSections();

    const location = useLocation();

    let filteredSections = sections;
    if (!location.pathname.startsWith('/editor/')) {
        filteredSections = filteredSections.filter((section) => section.id !== 'user');
    }

    const handleReset = () => {
        openModal({
            modalContent: {
                title: 'Reset Settings',
                content: 'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
            },
            modalButtons: [
                {
                    label: 'Cancel',
                    variant: 'outlined',
                    onClickFunction: () => { },
                },
                {
                    label: 'Reset',
                    autoFocus: true,
                    color: 'primary',
                    variant: 'contained',
                    onClickFunction: resetSettings,
                },
            ],
        });
    };

    if (!open) {
        return null;
    }

    return (
        <BackDrop>
            <Container
                maxWidth='lg'
                sx={{
                    height: isMobile ? '100vh' : '70vh',
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    p: '0px !important',
                    borderRadius: isMobile ? 0 : 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 4,
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h5'>Settings</Typography>
                    </Box>
                    <IconButton aria-label='close' color='inherit' edge='end' onClick={onClose}>
                        <CloseIcon />
                    </IconButton>

                </Box>

                <Box sx={{ display: 'flex', height: 'calc(100% - 72px)', position: 'relative' }}>
                    <Box
                        sx={{
                            height: '100%',
                            width: isMobile ? 72 : settingsSidebarWidth,
                            minWidth: isMobile ? 72 : settingsSidebarWidth,
                            overflow: 'auto',
                            position: 'relative',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            textAlign: 'center',
                        }}
                    >
                        <List component='nav' sx={{ p: 1 }}>
                            {filteredSections.map((section) => (
                                <ListItem key={section.id} disablePadding>
                                    <ListItemButton
                                        selected={activeSection === section.id}
                                        onClick={() => handleSectionChange(section.id)}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: 'action.selected',
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>{section.icon}</ListItemIcon>
                                        {!isMobile && <ListItemText primary={section.label} />}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                        <Button
                            variant='contained'
                            startIcon={<ResetIcon />}
                            onClick={handleReset}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                width: '93%',
                                position: 'absolute',
                                bottom: '12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                py: 1,
                            }}
                        >
                            Reset Settings
                        </Button>
                        <Button
                            variant='contained'
                            onClick={handleReset}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                width: '64px !important',
                                position: 'absolute',
                                bottom: '12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                py: 1,
                            }}
                        >
                            <ResetIcon />
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
                        {activeSection === 'appearance' && <AppearanceSettings />}
                        {activeSection === 'editor' && <EditorSettings />}
                        {activeSection === 'user' && <UserSettings />}
                        {activeSection === 'notifications' && <NotificationSettings />}
                        {activeSection === 'keyBindings' && <KeyBindingSettings />}
                    </Box>
                </Box>
            </Container>
        </BackDrop>
    );
};