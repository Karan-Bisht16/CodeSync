import React from 'react';
import { Box, FormControl, MenuItem, Select, Slider, Stack } from '@mui/material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing contexts
import { useSettingsContext } from '../contexts/Settings.context';
// importing components
import { CustomSelect } from '../../../components/CustomSelect';
import { SectionHeading } from './SectionHeading';
import { SectionSubHeading } from './SectionSubHeading';
import { SettingsCheckBox } from './SettingsCheckBox';

export const EditorSettings: React.FC = () => {
    const { editorThemes, languages } = constantsJSON;

    const { settings, updateSelectSettings, updateSliderSettings } = useSettingsContext();

    return (
        <Stack spacing={3}>
            <SectionHeading text='Editor' />
            <Box>
                <SectionSubHeading text='Default Language' />
                <CustomSelect
                    id='defaultLanguage'
                    name='editorDefaultLanguage'
                    value={settings.editorDefaultLanguage}
                    onChange={updateSelectSettings}
                    list={languages}
                />
            </Box>

            <Box>
                <SectionSubHeading text='Editor Theme' />
                <CustomSelect
                    id='editor-theme'
                    name='editorTheme'
                    value={settings.editorTheme}
                    onChange={updateSelectSettings}
                    list={editorThemes}
                />
            </Box>

            <Box>
                <SectionSubHeading text={`Font Size: ${settings.editorFontSize}px`} />
                <Slider
                    step={2}
                    min={8}
                    max={32}
                    marks
                    size='small'
                    valueLabelDisplay='auto'
                    name='editorFontSize'
                    value={settings.editorFontSize}
                    onChange={updateSliderSettings}
                />
            </Box>

            <Box>
                <SectionSubHeading text={`Tab Size: ${settings.editorTabSize} spaces`} />
                <FormControl fullWidth size='small'>
                    <Select
                        id='editor-tabsize-select'
                        labelId='editor-tabSize-select-label'
                        name='editorTabSize'
                        value={`${settings.editorTabSize}`}
                        onChange={updateSelectSettings}
                    >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <SectionHeading text='Terminal' />
            <Box>
                <SectionSubHeading text={`Font Size: ${settings.terminalFontSize}px`} />
                <Slider
                    step={2}
                    min={8}
                    max={32}
                    marks
                    size='small'
                    valueLabelDisplay='auto'
                    name='terminalFontSize'
                    value={settings.terminalFontSize}
                    onChange={updateSliderSettings}
                />
            </Box>

            <Stack spacing={1}>
                <SettingsCheckBox label='Line Numbers' name='editorLineNumbers' description='Display line numbers beside each line of code.' />
                <SettingsCheckBox label='Fold Gutter' name='editorFoldGutter' description='Show arrows to collapse or expand sections of code.' />
                <SettingsCheckBox label='Autocompletion' name='editorAutocompletion' description='Suggest code completions while typing.' />
                <SettingsCheckBox label='Indent On Input' name='editorIndentOnInput' description='Auto-indent code while typing.' />
                <SettingsCheckBox label='Close Brackets' name='editorCloseBrackets' description='Auto-close brackets when an opening one is typed.' />
                <SettingsCheckBox label='Bracket Matching' name='editorBracketMatching' description='Highlight matching brackets near the cursor.' />
                {/* TODO: check this one */}
                <SettingsCheckBox label='Allow Multiple Selections' name='editorAllowMultipleSelections' description='Enable editing multiple parts of code at once.' />
                <SettingsCheckBox label='Highlight Selection Matches' name='editorHighlightSelectionMatches' description='Highlight all matches of selected text.' />
                <SettingsCheckBox label='Drop Cursor' name='editorDropCursor' description='Show cursor during drag and drop of text.' />
                <SettingsCheckBox label='Fold Keymap' name='editorFoldKeymap' description='Enable shortcuts for folding and unfolding code.' />
                <SettingsCheckBox label='Completion Keymap' name='editorCompletionKeymap' description='Enable shortcuts for triggering and navigating autocomplete.' />
                <SettingsCheckBox label='Close Brackets Keymap' name='editorCloseBracketsKeymap' description='Enable shortcuts related to auto-closing brackets.' />
                {/* TODO: do this one */}
                <SettingsCheckBox label='Search Keymap' name='editorSearchKeymap' description='Enable shortcuts for searching in the editor.' />
                <SettingsCheckBox label='Lint Keymap' name='editorLintKeymap' description='Enable shortcuts for linting and quick fixes.' />
            </Stack>
        </Stack>
    );
};