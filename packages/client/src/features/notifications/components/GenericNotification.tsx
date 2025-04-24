import React from 'react';
import {
    Box,
    IconButton,
    Paper,
    Slide,
    Typography,
} from '@mui/material';
// importing icons
import {
    Close as CloseIcon,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing components
import { ToolTip } from '../../../components/ToolTip';

export type GenericNotificationProps = {
    show: boolean;
    message: string;
    closable?: boolean,
    onDismiss?(): void;
    icon?: React.ReactNode;
    avatars?: React.ReactNode[];
    maxWidth?: string | number;
    sx?: object,
};
export const GenericNotification: React.FC<GenericNotificationProps> = (props) => {
    const { show, message, closable = true, onDismiss, icon, avatars = [], maxWidth = '400px', sx = {} } = props;

    const { transitionDuration } = constantsJSON;

    return (
        <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000, maxWidth, pointerEvents: 'none' }}>
            <Slide
                timeout={transitionDuration}
                direction='left'
                in={show && message !== ''}
                mountOnEnter
                unmountOnExit
            >
                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        px: 2,
                        py: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        pointerEvents: 'auto',
                        ...sx
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {icon}

                        {avatars.length > 0 && (
                            <Box sx={{ height: 32, width: (avatars.length + 2) * 12, position: 'relative' }}>
                                {avatars.map((avatar, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: 'absolute',
                                            left: `${index * 12}px`,
                                            zIndex: 3 - index,
                                        }}
                                    >
                                        {avatar}
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <Typography variant='body2' fontWeight='medium'>
                            {message}
                        </Typography>
                    </Box>

                    {closable &&
                        <ToolTip title='Dismiss Notification'>
                            <IconButton size='small' onClick={onDismiss} sx={{ mb: '1px' }}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        </ToolTip>
                    }
                </Paper>
            </Slide>
        </Box>
    );
};