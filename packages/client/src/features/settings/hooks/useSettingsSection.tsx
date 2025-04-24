import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// importing icons
import {
    Code as EditorSettingsIcon,
    Person as UserSettingsIcon,
    Palette as AppearanceSettingsIcon,
    Notifications as NotificationSettingsIcon,
    Keyboard as KeyBindingSettingsIcon,
} from '@mui/icons-material';

export const useSettingsSections = () => {
    const sections = [
        { id: 'appearance', label: 'Appearance', icon: <AppearanceSettingsIcon /> },
        { id: 'editor', label: 'Editor', icon: <EditorSettingsIcon /> },
        { id: 'user', label: 'User', icon: <UserSettingsIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <NotificationSettingsIcon /> },
        { id: 'keyBindings', label: 'Keyboard Shortcuts', icon: <KeyBindingSettingsIcon /> },
    ];

    const [activeSection, setActiveSection] = useState('appearance');
    const location = useLocation();

    // Set editor section as default if coming from editor
    useEffect(() => {
        if (location.pathname.startsWith('/editor/')) {
            setActiveSection('editor');
        }
    }, [location]);

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
    };

    return { sections, activeSection, handleSectionChange };
};