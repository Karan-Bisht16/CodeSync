import React, { useEffect } from 'react';
import {
    Box,
    Button,
    Divider,
    Paper,
    Slide,
    Stack,
    Typography,
} from '@mui/material';
// importing icons
import {
    AdminPanelSettings,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing types
import type { SocketUser } from '@codesync/shared';
// importing hooks
import { useNotificationSound } from '../hooks/useNotificationSound';
// importing contexts
import { useSocketContext } from '../../../contexts/Socket.context';
// importing components
import { UserAvatars } from '../../../components/UserAvatars';
// importing utils
import { formattedString } from '../../../utils/helpers.util';

export const JoinRequestNotifications: React.FC = () => {
    const { joinRequestQueue, resolveJoinRequest, resolveJoinRequestAll } = useSocketContext();

    const { transitionDuration } = constantsJSON;

    const playJoinRequestSound = useNotificationSound('notificationAudioJoinRequest');

    const message = (joinRequestQueue.length === 1
        ? `Someone wants` :
        `${joinRequestQueue.length} people want`) + ' to join this call';

    useEffect(() => {
        if (joinRequestQueue.length > 0) {
            playJoinRequestSound();
        }
    }, []);

    if (joinRequestQueue.length === 0) return null;

    return (
        <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 200, pointerEvents: 'none' }}>
            <Slide timeout={transitionDuration} direction='left' in={true} mountOnEnter unmountOnExit>
                <Paper
                    elevation={3}
                    sx={{
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        pointerEvents: 'auto', minWidth: '300px'
                    }}
                >
                    <Box
                        sx={{
                            height: 100,
                            width: 100,
                            position: 'absolute',
                            right: -20,
                            top: -20,
                            zIndex: 0,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            opacity: 0.05,
                        }}
                    />
                    <Stack spacing={2} sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                            {joinRequestQueue.length > 1 &&
                                <UserAvatars
                                    users={joinRequestQueue as SocketUser[]}
                                    size={40}
                                    sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                />
                            }
                            <Box>
                                <Typography variant='body1' fontWeight='medium'>
                                    {message}
                                </Typography>
                                {joinRequestQueue.length > 1 &&
                                    joinRequestQueue.map((user, index) => (
                                        <Typography variant='caption' color='text.secondary'>
                                            {formattedString(user.username)}
                                            {index !== joinRequestQueue.length - 1 && ', '}
                                        </Typography>
                                    ))
                                }
                            </Box>
                        </Box>
                        <Divider />
                        {joinRequestQueue.map((user, index) => {
                            return (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <UserAvatars users={[user as SocketUser]} />
                                        <Typography>
                                            {formattedString(user.username)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Button
                                            fullWidth
                                            size='small'
                                            color='primary'
                                            variant='contained'
                                            onClick={() => resolveJoinRequest({ user: user as SocketUser, accept: true })}
                                        >
                                            Admit
                                        </Button>
                                        <Button
                                            fullWidth
                                            size='small'
                                            variant='contained'
                                            sx={{ bgcolor: 'error.dark', color: 'error.contrastText' }}
                                            onClick={() => resolveJoinRequest({ user: user as SocketUser, accept: false })}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                </Box>
                            );
                        })}

                        {joinRequestQueue.length > 1 &&
                            <>
                                <Divider />
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, pt: 0 }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <AdminPanelSettings fontSize='small' />
                                        <Typography fontSize={12} sx={{ color: 'text.secondary' }}>
                                            As a host you can remove anyone at any time
                                        </Typography>
                                    </Box>
                                    {/* TODO: Add this */}
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: '175px' }}>
                                        <Button
                                            fullWidth
                                            size='small'
                                            color='primary'
                                            variant='contained'
                                            onClick={() => resolveJoinRequestAll(true)}
                                        >
                                            Admit all
                                        </Button>
                                        <Button
                                            fullWidth
                                            size='small'
                                            variant='contained'
                                            onClick={() => resolveJoinRequestAll(false)}
                                            sx={{ bgcolor: 'error.dark', color: 'error.contrastText' }}
                                        >
                                            Reject all
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        }
                    </Stack>
                </Paper>
            </Slide>
        </Box>
    );
};