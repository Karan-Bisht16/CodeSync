import React, { useEffect, useRef } from 'react';
import { Box, IconButton, Tab, Tabs } from '@mui/material';
// importing icons
import { KeyboardArrowDown } from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing contexts
// importing components
import { ToolTip } from '../../../components/ToolTip';
import { useSettingsContext } from '../../settings';
import { usePanelContext } from '../../../contexts/Panel.context';
import { useEditorContext } from '../../editor';

export const TerminalPanel: React.FC = () => {
    const { terminalPanelHeight } = constantsJSON;

    const { settings } = useSettingsContext();
    const { editorInput, editorOutput, handleEditorInputChange } = useEditorContext();
    const {
        activeTerminalTab,
        handleActiveTerminalTabChange,
        terminalPanel,
        closeTerminalPanel,
    } = usePanelContext();

    const inputFieldRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (activeTerminalTab === 0 && inputFieldRef.current) {
            inputFieldRef.current.focus();
        }
    }, [activeTerminalTab, terminalPanel]);

    return (
        <Box
            sx={{
                display: terminalPanel ? 'block' : 'none',
                height: terminalPanelHeight,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Tabs
                    value={activeTerminalTab}
                    onChange={handleActiveTerminalTabChange}
                    sx={{ minHeight: '40px' }}
                >
                    <Tab label='Input' sx={{ minHeight: '40px', textTransform: 'none', fontSize: '0.875rem' }} />
                    <Tab label='Output' sx={{ minHeight: '40px', textTransform: 'none', fontSize: '0.875rem' }} />
                    <Tab label='Console' sx={{ minHeight: '40px', textTransform: 'none', fontSize: '0.875rem' }} />
                </Tabs>
                <ToolTip title='Close Terminal'>
                    <IconButton size='small' onClick={closeTerminalPanel}>
                        <KeyboardArrowDown fontSize='small' />
                    </IconButton>
                </ToolTip>
            </Box>

            <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto', fontFamily: 'monospace', fontSize: `${settings.terminalFontSize}px`, color: 'text.secondary' }}>
                {activeTerminalTab === 0 && (
                    <textarea
                        ref={inputFieldRef}
                        placeholder='Enter input here'
                        value={editorInput}
                        onChange={handleEditorInputChange}
                        className='h-[95%] w-full resize-none text-inherit bg-inherit outline-none p-2'
                    />
                )}
                {activeTerminalTab === 1 && (
                    <Box sx={{ height: '100%', color: editorOutput.status ? `${editorOutput.status}.dark` : 'text.secondary' }}>
                        <textarea
                            placeholder='Output will be displayed here'
                            value={editorOutput.output}
                            disabled={true}
                            className='h-full w-full resize-none text-inherit bg-inherit outline-none p-2'
                        />
                    </Box>
                )}
                {activeTerminalTab === 2 && (
                    <div className='h-[95%] w-full resize-none bg-inherit outline-none p-2'>
                        {/* TODO: show prettier detailed error here */}
                        &lt; Program executed successfully
                    </div>
                )}
            </Box>
        </Box>
    );
};