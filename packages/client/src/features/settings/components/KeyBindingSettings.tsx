import React from 'react';
import { Box, Stack } from '@mui/material';
// importing components
import { SectionHeading } from './SectionHeading';
import { SectionSubHeading } from './SectionSubHeading';
import { HotkeyDisplay } from './HotkeyDisplay';

{/* TODO: map the key bindings for both windows and mac */ }
export const KeyBindingSettings: React.FC = () => {
    
    return (
        <Stack spacing={4}>
            <SectionHeading text='Keyboard Shortcuts' />
            <Box>
                <SectionSubHeading text='Editor' />
                <Stack spacing={1}>
                    <HotkeyDisplay text='Run Code' binding='Ctrl + Enter' />
                    <HotkeyDisplay text='Save Room' binding='Ctrl + Shift + S' />
                </Stack>
            </Box>

            <Box>
                <SectionSubHeading text='Search Keymap' />
                <Stack spacing={1}>
                    <HotkeyDisplay text='Open Search Panel' binding='Ctrl + F' />
                    <HotkeyDisplay text='Find Next' binding='Enter' info='When Find field is in focus' />
                    <HotkeyDisplay text='Find Previous' binding='Shift + Enter' />
                    <HotkeyDisplay text='Replace Next' binding='Enter' info='When Replace field is focused' />
                    <HotkeyDisplay text='Replace All' binding='Ctrl + Alt + Enter' />
                    <HotkeyDisplay text='Toggle between Find and Replace Fields' binding='Tab' />
                </Stack>
            </Box>

            <Box>
                <SectionSubHeading text='Fold Keymap' />
                <Stack spacing={1}>
                    <HotkeyDisplay text='Fold Current Block' binding='Ctrl + Shift + [' />
                    <HotkeyDisplay text='Unfold Current Block' binding='Ctrl + Shift + ]' />
                    <HotkeyDisplay text='Fold All' binding='Ctrl + Alt + [' />
                    <HotkeyDisplay text='Unfold All' binding='Ctrl + Alt + ]' />
                </Stack>
            </Box>

            <Box>
                <SectionSubHeading text='Completion Keymap' />
                <Stack spacing={1}>
                    <HotkeyDisplay text='Trigger Autocomplete' binding='Ctrl + Space' />
                    <HotkeyDisplay text='Close Autocomplete' binding='Escape' />
                    <HotkeyDisplay text='Select Next Suggestion' binding='Arrow Down / Page Down' />
                    <HotkeyDisplay text='Select Previous Suggestion' binding='Arrow Up / Page Up' />
                    <HotkeyDisplay text='Accept Suggestion' binding='Enter' />
                </Stack>
            </Box>

            <Box>
                <SectionSubHeading text='Lint Keymap' />
                <Stack spacing={1}>
                    <HotkeyDisplay text='Move Cursor by Syntax Left' binding='Alt + Arrow Left' />
                    <HotkeyDisplay text='Move Cursor by Syntax Right' binding='Alt + Arrow Right' />
                    <HotkeyDisplay text='Move Line Up' binding='Alt + Arrow Up' />
                    <HotkeyDisplay text='Move Line Down' binding='Alt + Arrow Down' />
                    <HotkeyDisplay text='Copy Line Up' binding='Shift + Alt + Arrow Up' />
                    <HotkeyDisplay text='Copy Line Down' binding='Shift + Alt + Arrow Down' />
                    <HotkeyDisplay text='Insert Blank Line' binding='Ctrl + Enter' />
                    <HotkeyDisplay text='Select Current Line' binding='Alt + L' />
                    <HotkeyDisplay text='Select Parent Syntax Block' binding='Ctrl + I' />
                    <HotkeyDisplay text='Indent Less' binding='Ctrl + [' />
                    <HotkeyDisplay text='Indent More' binding='Ctrl + ]' />
                    <HotkeyDisplay text='Indent Selection' binding='Ctrl + Alt + \\' />
                    <HotkeyDisplay text='Delete Line' binding='Shift + Ctrl + K' />
                    <HotkeyDisplay text='Jump to Matching Bracket' binding='Shift + Ctrl + \\' />
                    <HotkeyDisplay text='Toggle Comment' binding='Ctrl + /' />
                    <HotkeyDisplay text='Toggle Block Comment' binding='Shift + Alt + A' />
                    <HotkeyDisplay text='Toggle Tab Focus Mode' binding='Ctrl + M' />
                </Stack>
            </Box>


            <Box>
                <SectionSubHeading text='Application' />
                <Stack spacing={1}>
                    <HotkeyDisplay text='Toggle Terminal' binding='Ctrl + `' />
                    <HotkeyDisplay text='Toggle File Explorer' binding='Ctrl + B' />
                    <HotkeyDisplay text='Open Settings' binding='Ctrl + ,' last={true} />
                </Stack>
            </Box>
        </Stack>
    );
};