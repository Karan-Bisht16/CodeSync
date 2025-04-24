import React from 'react';
import { Box, IconButton } from '@mui/material';
// importing icons
import { ContentPasteOutlined, FolderCopy, Search, Terminal as TerminalIcon } from '@mui/icons-material';
// importing types
import type { ReactNode } from 'react';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing contexts
import { usePanelContext } from '../../../contexts/Panel.context';
// importing components
import { ToolTip } from '../../../components/ToolTip';

type ActivityDockProps = {
    openWhiteboard(): void,
};

export const ActivityDock: React.FC<ActivityDockProps> = (props) => {
    const { openWhiteboard } = props;

    const { activityDockWidth } = constantsJSON;

    const { dynamicPanel, openDynamicPanel, terminalPanel, openTerminalPanel } = usePanelContext();

    type SideBarButtonProps = {
        label: string,
        icon: ReactNode,
    };
    const SideBarButton: React.FC<SideBarButtonProps> = (props) => {
        const { label, icon } = props;

        return (
            <Box sx={{ bgcolor: dynamicPanel === label ? 'text.primary' : 'transparent' }}>
                <ToolTip title={label} placement='right'>
                    <IconButton
                        onClick={() => openDynamicPanel(label)}
                        sx={{
                            height: activityDockWidth,
                            width: activityDockWidth,
                            position: 'relative',
                            color: dynamicPanel === label ? 'primary.main' : 'inherit',
                            bgcolor: dynamicPanel === label ? 'background.default' : 'transparent',
                            borderRadius: 0,
                            opacity: dynamicPanel === label ? '0.95' : '1',
                            ':hover': { bgcolor: dynamicPanel === label ? 'background.default' : 'none' },
                        }}
                    >
                        {dynamicPanel === label && (
                            <Box sx={{ height: '100%', width: '2px', position: 'absolute', left: 0, bgcolor: 'text.primary' }} />
                        )}
                        {icon}
                    </IconButton>
                </ToolTip>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                width: activityDockWidth,
                color: 'text.secondary',
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                zIndex: 1,
            }}
        >
            <SideBarButton
                label='File Explorer'
                icon={<FolderCopy sx={{ height: '20px', width: '20px' }} />}
            />
            <SideBarButton
                label='Search'
                icon={<Search sx={{ height: '20px', width: '20px' }} />}
            />

            {/* Bottom sidebar buttons */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    mt: 'auto',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <ToolTip title='Open Terminal (Ctrl + `)' placement='right'>
                    <IconButton
                        onClick={() => openTerminalPanel(0)}
                        sx={{
                            height: activityDockWidth,
                            width: activityDockWidth,
                            color: terminalPanel ? 'primary.main' : 'inherit',
                            borderRadius: 0,
                        }}
                    >
                        <TerminalIcon />
                    </IconButton>
                </ToolTip>

                <ToolTip title='Open Whiteboard' placement='right'>
                    <IconButton
                        onClick={openWhiteboard}
                        sx={{
                            height: activityDockWidth,
                            width: activityDockWidth,
                            color: 'inherit',
                            borderRadius: 0,
                        }}
                    >
                        <ContentPasteOutlined />
                    </IconButton>
                </ToolTip>
            </Box>
        </Box>
    );
};