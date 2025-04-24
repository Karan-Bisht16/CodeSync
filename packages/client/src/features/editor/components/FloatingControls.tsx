import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Badge,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper
} from '@mui/material';
// importing icons
import {
    AdminPanelSettings as HostControlsIcon,
    CallEnd as LeaveCallIcon,
    ChatOutlined as ChatIcon,
    ContentCopyOutlined as CopyRoomIDIcon,
    Download as DownloadCodeIcon,
    FrontHand as HandRaisedIcon,
    FrontHandOutlined as RaiseHandIcon,
    MoreVert as MoreVertIcon,
    PeopleAltOutlined as ParticipantsIcon,
    Share as ShareCodeIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
// importing features
import { useNotificationSound } from '../../notifications';
import { useRoomContext } from '../../room';
import { useUserContext } from '../../user';
// importing contexts
import { useMobileContext } from '../../../contexts/Mobile.context';
import { useModalContext } from '../../../contexts/Modal.context';
import { usePanelContext } from '../../../contexts/Panel.context';
import { useSnackBarContext } from '../../../contexts/SnackBar.context';
import { useSocketContext } from '../../../contexts/Socket.context';
// importing components
import { ToolTip } from '../../../components/ToolTip';
// importing hooks
import { hasPermission } from '@codesync/shared';

export const FloatingControls: React.FC = () => {
    const { isMobile } = useMobileContext();
    const { openModal } = useModalContext();
    const { engagementPanel, openEngagementPanel, openHostControlsModal } = usePanelContext();
    const { room } = useRoomContext();
    const { openSnackBar } = useSnackBarContext();
    const { messages, participants, leaveRoom, raiseHand, downloadCode } = useSocketContext();
    const { user } = useUserContext();

    const playChatNotification = useNotificationSound('notificationAudioChatMessages');

    const [unreadMessages, setUnreadMessages] = useState(0);
    const prevMessagesLengthdRef = useRef(messages.length);

    useEffect(() => {
        if (messages.length > prevMessagesLengthdRef.current) {
            const lastMessage = messages[messages.length - 1];

            if (!lastMessage.countsAsUnread) {
                return;
            }

            if (lastMessage.sender.userID === user.userID) {
                return;
            }

            if (engagementPanel !== 'chat') {
                setUnreadMessages((prev) => prev + 1);
                playChatNotification();
            }
        }
        prevMessagesLengthdRef.current = messages.length;
    }, [messages, engagementPanel]);

    useEffect(() => {
        if (engagementPanel === 'chat') {
            setUnreadMessages(0);
        }
    }, [engagementPanel]);

    const canAccessHostControls = useMemo(() => {
        return hasPermission(user, 'rooms', 'host-controls', room);
    }, [user, room]);

    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorElement(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorElement(null);
    };

    const handleDownloadCode = () => {
        downloadCode();
        closeMenu();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        openSnackBar({
            status: 'success',
            message: 'Room link copied to clipboard.'
        })
        closeMenu();
    };

    const handleLeave = () => {
        openModal({
            isPersistent: false,
            modalContent: {
                title: 'Leave',
                content: 'Are you sure you want to leave this meeting? To join again, use the same link.',
            },
            modalButtons: [{
                label: 'Leave',
                autoFocus: true,
                color: 'error',
                variant: 'contained',
                onClickFunction: () => leaveRoom(),
            }],
        });
    };

    return (
        <Paper
            elevation={3}
            sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                bottom: 20,
                left: '50%',
                zIndex: 10,
                transform: 'translateX(-50%)',
                color: 'text.secondary',
                bgcolor: 'background.paper',
                px: { xs: 1, md: 2 },
                py: { xs: 0.75, md: 1 },
                borderRadius: '50px',
            }}
        >
            {/* Raise Hand */}
            <ToolTip title={user.handRaised ? 'Hand Raised' : 'Raise Hand'}>
                <IconButton
                    color='inherit'
                    size='medium'
                    onClick={raiseHand}
                    sx={{
                        color: user.handRaised ? 'primary.main' : 'inherit',
                        mx: 0.5,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {user.handRaised
                        ? <HandRaisedIcon /> :
                        <RaiseHandIcon />
                    }
                </IconButton>
            </ToolTip>

            {/* Participants */}
            <ToolTip title='Participants'>
                <IconButton
                    color='inherit'
                    size='medium'
                    onClick={() => openEngagementPanel('participants')}
                    sx={{
                        color: engagementPanel === 'participants' ? 'primary.main' : 'inherit',
                        mx: 0.5,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Badge
                        badgeContent={participants.length}
                        color='primary'
                        sx={{
                            '& .MuiBadge-badge': {
                                padding: '0 4px',
                                border: '1px solid',
                                borderColor: 'background.paper',
                            },
                        }}
                    >
                        <ParticipantsIcon />
                    </Badge>
                </IconButton>
            </ToolTip>

            {/* Chat */}
            <ToolTip title='Chat'>
                <IconButton
                    color='inherit'
                    size='medium'
                    onClick={() => openEngagementPanel('chat')}
                    sx={{
                        color: engagementPanel === 'chat' ? 'primary.main' : 'inherit',
                        mx: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        animation: unreadMessages > 0 ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': {
                                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
                            },
                            '70%': {
                                boxShadow: '0 0 0 6px rgba(25, 118, 210, 0)',
                            },
                            '100%': {
                                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                            },
                        },
                    }}
                >
                    <Badge
                        badgeContent={unreadMessages}
                        color='primary'
                        sx={{
                            '& .MuiBadge-badge': {
                                padding: '0 4px',
                                border: '1px solid',
                                borderColor: 'background.paper',
                            },
                        }}
                    >
                        <ChatIcon />
                    </Badge>
                </IconButton>
            </ToolTip>

            {/* Host Controls */}
            {canAccessHostControls && (
                <ToolTip title='Host Controls'>
                    <IconButton
                        color='inherit'
                        onClick={openHostControlsModal}
                        sx={{ mx: 0.5, border: '1px solid', borderColor: 'divider' }}
                    >
                        <HostControlsIcon />
                    </IconButton>
                </ToolTip>
            )}

            {/* More Actions */}
            <ToolTip title='More Actions'>
                <IconButton
                    color='inherit'
                    onClick={openMenu}
                    sx={{ mx: 0.5, border: '1px solid', borderColor: 'divider' }}
                >
                    <MoreVertIcon />
                </IconButton>
            </ToolTip>
            <Menu
                anchorEl={menuAnchorElement}
                open={Boolean(menuAnchorElement)}
                onClose={closeMenu}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* TODO: make a hook for these functions (copyRoomID, saveRoom) so that they can be used here and in Editor.page.tsx  */}
                {isMobile &&
                    <MenuItem onClick={handleShare}>
                        <ListItemIcon>
                            <CopyRoomIDIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText>Copy Room ID</ListItemText>
                    </MenuItem>
                }
                <MenuItem onClick={handleDownloadCode}>
                    <ListItemIcon>
                        <DownloadCodeIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Download Code</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleShare}>
                    <ListItemIcon>
                        <ShareCodeIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Share</ListItemText>
                </MenuItem>
                {isMobile &&
                    <MenuItem onClick={handleShare}>
                        <ListItemIcon>
                            <SaveIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText>Save Room</ListItemText>
                    </MenuItem>
                }
            </Menu>

            <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

            {/* Leave Room */}
            <ToolTip title='Leave Room'>
                <Button
                    variant='contained'
                    color='error'
                    size='small'
                    startIcon={<LeaveCallIcon />}
                    onClick={handleLeave}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        minWidth: 'auto',
                        px: 2,
                        mx: 0.5,
                        borderRadius: '50px',
                    }}
                >
                    Leave
                </Button>
                <Button
                    variant='contained'
                    color='error'
                    size='small'
                    onClick={handleLeave}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        minWidth: 'auto',
                        px: 2,
                        mx: 0.5,
                        borderRadius: '50px',
                    }}
                >
                    <LeaveCallIcon />
                </Button>
            </ToolTip>
        </Paper>
    );
};