import type { SelectChangeEvent } from '@mui/material';
import type { Theme } from '../../types/Color.types';

export type SettingsState = {
    theme: Theme,

    editorTheme: string,
    editorFontSize: number,
    editorTabSize: 2 | 4 | 8,
    editorLineNumbers: boolean,
    editorFoldGutter: boolean,
    editorAutocompletion: boolean,
    editorIndentOnInput: boolean,
    editorCloseBrackets: boolean,
    editorBracketMatching: boolean,
    editorAllowMultipleSelections: boolean,
    editorHighlightSelectionMatches: boolean,
    editorDropCursor: boolean,
    editorFoldKeymap: boolean,
    editorCompletionKeymap: boolean,
    editorCloseBracketsKeymap: boolean,
    editorSearchKeymap: boolean,
    editorLintKeymap: boolean,
    editorDefaultLanguage: string,

    terminalFontSize: number,

    notifyHandRaised: boolean,
    notificationAudioEnabled: boolean,
    notificationAudioHandRaised: boolean,
    notificationAudioChatMessages: boolean,
    notificationAudioCodeExecutionFinised: boolean,
    notificationAudioJoinRequest: boolean,
    notificationVolume: number
};

export type SettingsContextType = {
    settings: SettingsState,
    updateTheme(theme: Theme): void,
    updateSelectSettings(event: SelectChangeEvent): void,
    updateSliderSettings(event: Event, value: number | number[]): void,
    updateCheckboxSettings(event: React.ChangeEvent<HTMLInputElement>): void,
    resetSettings(): void,
    settingsModal: boolean,
    openSettingsModal(): void,
    closeSettingsModal(): void,
};