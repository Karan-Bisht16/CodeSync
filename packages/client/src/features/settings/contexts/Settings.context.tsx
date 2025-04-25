import React, { createContext, useContext, useState } from 'react';
// importing types
import type { SelectChangeEvent } from '@mui/material';
import type { Theme } from '../../../types/Color.types';
import type { ContextChildrenProps } from '../../../types/Context.types';
import type { SettingsContextType, SettingsState } from '../types';

const defaultSettings: SettingsState = {
    theme: 'dark',

    editorTheme: 'vscodeDark',
    editorFontSize: 14,
    editorTabSize: 4,
    editorLineNumbers: true,
    editorFoldGutter: true,
    editorAutocompletion: true,
    editorIndentOnInput: true,
    editorCloseBrackets: true,
    editorBracketMatching: true,
    editorAllowMultipleSelections: true,
    editorHighlightSelectionMatches: true,
    editorDropCursor: true,
    editorFoldKeymap: true,
    editorCompletionKeymap: true,
    editorSearchKeymap: true,
    editorCloseBracketsKeymap: true,
    editorLintKeymap: true,
    editorDefaultLanguage: 'javascript-v8.10.0',

    terminalFontSize: 14,

    notifyHandRaised: true,
    notificationAudioEnabled: true,
    notificationAudioHandRaised: true,
    notificationAudioChatMessages: true,
    notificationAudioCodeExecutionFinised: true,
    notificationAudioJoinRequest: true,
    notificationVolume: 70,
};

export const SettingsContext = createContext<SettingsContextType>({
    settings: {} as SettingsState,
    updateTheme: (_theme: Theme) => { },
    updateSelectSettings: (_event: SelectChangeEvent) => { },
    updateSliderSettings: (_event: Event, _value: number | number[]) => { },
    updateCheckboxSettings: (_event: React.ChangeEvent<HTMLInputElement>) => { },
    resetSettings: () => { },
    settingsModal: false,
    openSettingsModal: () => { },
    closeSettingsModal: () => { },
});
export const useSettingsContext = () => useContext(SettingsContext);
export const SettingsProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsState>(() => {
        const savedSettings = localStorage.getItem('codesync-settings')
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings
    });

    const updateTheme = (theme: Theme) => {
        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                "theme": theme,
            };
            localStorage.setItem('codesync-settings', JSON.stringify(updatedSettings));
            return updatedSettings;
        });
    };

    const updateCheckboxSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                [name]: checked
            };
            localStorage.setItem('codesync-settings', JSON.stringify(updatedSettings));
            return updatedSettings;
        });
    };

    const updateSelectSettings = (event: SelectChangeEvent) => {
        const { name, value } = event.target;

        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                [name]: value
            };
            localStorage.setItem('codesync-settings', JSON.stringify(updatedSettings));
            return updatedSettings;
        });
    };

    const updateSliderSettings = (
        event: Event,
        value: number | number[]
    ) => {
        const target = event.target as HTMLSpanElement & { name?: string };
        const { name } = target;

        if (!name) return;

        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                [name]: typeof value === 'number' ? value : value[0],
            };
            localStorage.setItem('codesync-settings', JSON.stringify(updatedSettings));
            return updatedSettings;
        });
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.setItem('codesync-settings', JSON.stringify(defaultSettings));
    };

    // State for settings modal
    const [settingsModal, setSettingsModal] = useState<boolean>(false);
    const openSettingsModal = () => {
        setSettingsModal(true);
    };
    const closeSettingsModal = () => {
        setSettingsModal(false);
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateTheme,
            updateSelectSettings,
            updateSliderSettings,
            updateCheckboxSettings,
            resetSettings,
            settingsModal,
            openSettingsModal,
            closeSettingsModal,
        }}
        >
            {children}
        </SettingsContext.Provider>
    );
};