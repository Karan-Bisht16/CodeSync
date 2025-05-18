import React, { memo, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
// importing icons
import {
    FrontHand as HandRaisedIcon,
    Info as InfoIcon,
    KeyboardArrowRight as DrawerCloseIcon,
    MoreVert as MoreVertIcon,
    PersonAddAlt1 as AssignRoleIcon,
    PlayArrow as PlayArrowIcon,
    RemoveCircle as KickUserIcon,
    Search as SearchIcon,
    Send as SendIcon,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing types
import type { Message, Role, SocketUser } from '@codesync/shared';
// importing features
import { useUserContext } from '../../user';
// importing contexts
import { useSocketContext } from '../../../contexts/Socket.context';
import { usePanelContext } from '../../../contexts/Panel.context';
import { useMobileContext } from '../../../contexts/Mobile.context';
// importing hooks
import { useNoScroll } from '../../../hooks/useNoScroll';
// importing components
import { ToolTip } from '../../../components/ToolTip';
import { UserAvatars } from '../../../components/UserAvatars';
// importing utils
import { hasPermission } from '@codesync/shared';
import { formattedString } from '../../../utils/helpers.util';
import { RolesPermissionsModal } from './RolesPermissionModal';

type MessageItemProps = {
    message: Message,
    sameSender: boolean,
};

const MessageItem: React.FC<MessageItemProps> = memo((props) => {
    const { message, sameSender } = props;
    const { sender, content, isAnnouncement = false, timestamp } = message;

    const { user } = useUserContext();

    const time = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isCurrentUser = sender.userID === user.userID;

    if (isAnnouncement) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    my: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '12px',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        color: 'text.secondary',
                        border: '1px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant='caption' sx={{ minWidth: '56px', fontWeight: 500 }}>
                        {time}
                    </Typography>
                    <Divider orientation='vertical' flexItem />
                    <Typography variant='caption' sx={{ wordBreak: 'break-word' }}>{content}</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                maxWidth: '100%',
                my: 0.5,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    gap: 2,
                    maxWidth: '85%',
                    mt: sameSender ? 0 : 1,
                }}
            >
                {(!isCurrentUser && !sameSender) ?
                    <ToolTip title={sender.username} placement='top'>
                        <UserAvatars
                            users={[sender]}
                            size={24}
                            fontSize={12}
                        />
                    </ToolTip>
                    : <div style={{ minWidth: isCurrentUser ? '4px' : '24px' }} />
                }
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: '100%',
                        color: 'primary.contrastText',
                        bgcolor: isCurrentUser ? 'primary.main' : 'primary.dark',
                        px: 1,
                        py: 0.5,
                        borderRadius: 2,
                        boxShadow: 1,
                        wordBreak: 'break-word',
                    }}
                >
                    {isCurrentUser && !sameSender &&
                        <PlayArrowIcon
                            sx={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-12px',
                                color: 'primary.main',
                                transform: 'rotate(90deg)',
                            }}
                        />
                    }
                    {!isCurrentUser && !sameSender &&
                        <PlayArrowIcon
                            sx={{
                                position: 'absolute',
                                top: '-8px',
                                left: '-12px',
                                color: 'primary.dark',
                                transform: 'rotate(90deg)',
                            }}
                        />
                    }
                    <span className='text-sm font-medium'>{content}</span>
                    <br />
                    <p className='text-[8px] text-right font-thin'>{time}</p>
                </Box>
            </Box>
        </Box>
    );
}, (prevProps, nextProps) => {
    return prevProps.message.timestamp === nextProps.message.timestamp &&
        prevProps.message.content === nextProps.message.content;
});

type ParticipantItemProps = {
    participant: SocketUser,
};

const ParticipantItem: React.FC<ParticipantItemProps> = (props) => {
    const { participant } = props
    const { userID, username, handRaised } = participant;

    const { user } = useUserContext();
    const { assignRole, kickUser } = useSocketContext();

    let label = formattedString(username);
    if (userID === user.userID) {
        label += ' (You)';
    }
    let role;
    let roleChange: { role: Role | null, label: string } = { role: null, label: 'Unknown action' };
    if (participant.roles?.includes('host')) {
        role = 'Host';
    } else if (participant.roles?.includes('moderator')) {
        role = 'Moderator';
        roleChange = { role: 'user', label: 'Revoke moderator role' };
    } else if (participant.roles?.includes('user')) {
        roleChange = { role: 'moderator', label: 'Assign moderator role' };
    }

    const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorElement(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuAnchorElement(null);
    };

    const handleAssignRole = () => {
        assignRole({ targetUser: participant, role: roleChange.role! });
        closeMenu();
    };

    const handleKickUser = () => {
        kickUser({ targetUser: participant });
        closeMenu();
    };

    return (
        <ListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ListItemIcon>
                <UserAvatars users={[participant]} fontSize={16} />
            </ListItemIcon>
            <ListItemText primary={label} secondary={role} />
            {handRaised &&
                <HandRaisedIcon
                    fontSize='small'
                    sx={{ color: 'primary.main', mr: 1 }}
                />
            }
            {hasPermission(user, 'users', 'more-actions', participant) &&
                <ToolTip title='More Actions'>
                    <IconButton
                        color='inherit'
                        onClick={openMenu}
                        sx={{ mx: 1 }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </ToolTip>
            }
            <Menu
                anchorEl={menuAnchorElement}
                open={Boolean(menuAnchorElement)}
                onClose={closeMenu}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {hasPermission(user, 'rooms', 'assign-role') &&
                    hasPermission(user, 'users', 'assign-role', participant) &&
                    roleChange.role !== null &&
                    <MenuItem onClick={handleAssignRole}>
                        <ListItemIcon>
                            <AssignRoleIcon />
                        </ListItemIcon>
                        <ListItemText>
                            {roleChange.label}
                        </ListItemText>
                    </MenuItem>
                }
                {hasPermission(user, 'rooms', 'kick') &&
                    hasPermission(user, 'users', 'kick', participant) &&
                    <MenuItem onClick={handleKickUser}>
                        <ListItemIcon>
                            <KickUserIcon />
                        </ListItemIcon>
                        <ListItemText>Remove from call</ListItemText>
                    </MenuItem>
                }
            </Menu>
        </ListItem>
    );
};

export const EngagementPanel: React.FC = () => {
    const { navbarHeight, engagementPanelWidth } = constantsJSON;

    const { isMobile } = useMobileContext();
    const { engagementPanel, closeEngagementPanel } = usePanelContext();
    const { messages, sendMessage, participants } = useSocketContext();
    const { user } = useUserContext();

    useNoScroll(isMobile);

    const [message, setMessage] = useState<string>('');
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const isSameSenderAsPrevious = (index: number): boolean => {
        if (index === 0) return false;
        if (messages[index - 1].isAnnouncement) return false;
        return _.isEqual(messages[index - 1].sender, messages[index].sender);
    };

    const handleSendMessage = () => {
        if (!message?.trim()) return;
        if (sendingMessage) return;

        setSendingMessage(true);
        try {
            sendMessage({ message });
            setMessage('');
        } catch (error: unknown) {
            console.error(error);
        }
        setSendingMessage(false);
    };

    const handleInputEnter = (key: React.KeyboardEvent<HTMLInputElement>) => {
        if (key.keyCode === 13) {
            handleSendMessage();
        }
    };

    const [rolesPermissionModal, setRolesPermissionModal] = useState(false);

    const openRolesPermissionModal = () => {
        setRolesPermissionModal(true);
    };
    const closeRolesPermissionModal = () => {
        setRolesPermissionModal(false);
    }
    const [participantSearchTerm, setParticipantSearchTerm] = useState<string>('')

    useEffect(() => {
        bottomRef.current?.scrollIntoView({});
    }, [engagementPanel, messages]);

    return (
        <Drawer
            variant='persistent'
            anchor='right'
            open={engagementPanel !== false}
            transitionDuration={0}
            sx={{
                display: engagementPanel ? 'block' : 'none',
                width: isMobile ? '100%' : engagementPanelWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    pt: navbarHeight,
                    width: isMobile ? '100%' : engagementPanelWidth,
                    boxSizing: 'border-box',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                    zIndex: (theme) => theme.zIndex.appBar - 1,
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {engagementPanel === 'chat' && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography variant='subtitle1' fontWeight='bold'>
                                Chat
                            </Typography>
                            <ToolTip title='Close'>
                                <IconButton size='small' onClick={closeEngagementPanel}>
                                    <DrawerCloseIcon fontSize='small' />
                                </IconButton>
                            </ToolTip>
                        </Box>
                        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                            <Box sx={{ px: 2, py: 1, mb: 2, bgcolor: 'action.hover', borderRadius: 4 }}>
                                <Typography variant='caption' component='p' sx={{ color: 'text.secondary' }}>
                                    When you leave the call, you won't be able to access this chat
                                </Typography>
                            </Box>
                            {messages.length === 0 &&
                                <Typography variant='body2' color='text.secondary' align='center'>
                                    No messages yet
                                </Typography>
                            }
                            {messages.map((message: Message, index) => (
                                <MessageItem
                                    key={index}
                                    message={message}
                                    sameSender={isSameSenderAsPrevious(index)}
                                />
                            ))}
                            <div ref={bottomRef} />
                        </Box>
                        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                fullWidth
                                autoFocus={true}
                                autoComplete='off'
                                variant='outlined'
                                placeholder='Type a message...'
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                onKeyUp={handleInputEnter}
                                sx={{ border: 'none', '& fieldset': { border: 'none' }, }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment
                                                position='end'
                                                onClick={handleSendMessage}
                                                sx={{ color: 'primary.main', cursor: 'pointer' }}
                                            >
                                                <ToolTip title='Send message'>
                                                    <SendIcon />
                                                </ToolTip>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    </>
                )}
                {engagementPanel === 'participants' && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography variant='subtitle1' fontWeight='bold'>
                                    Participants ({participants.length})
                                </Typography>
                                <ToolTip title='Learn more about participants types and roles'>
                                    <IconButton size='small' onClick={openRolesPermissionModal}>
                                        <InfoIcon fontSize='small' />
                                    </IconButton>
                                </ToolTip>
                            </Box>
                            <ToolTip title='Close'>
                                <IconButton size='small' onClick={closeEngagementPanel}>
                                    <DrawerCloseIcon fontSize='small' />
                                </IconButton>
                            </ToolTip>
                        </Box>
                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                fullWidth
                                size='small'
                                placeholder='Search participants...'
                                value={participantSearchTerm}
                                onChange={(e) => setParticipantSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SearchIcon fontSize='small' />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                        <Box sx={{ flexGrow: 1, pl: 1, overflowY: 'auto' }}>
                            {/* Host & Moderators section */}
                            {participants.filter(
                                (p) =>
                                    (p.roles?.includes('moderator') || p.roles?.includes('host')) &&
                                    p.username.toLowerCase().includes(participantSearchTerm.toLowerCase()),
                            ).length > 0 && (
                                    <>
                                        <Typography variant='subtitle2' sx={{ px: 2, py: 1, color: 'text.secondary', mt: 1 }}>
                                            Host & Moderators
                                        </Typography>
                                        <List disablePadding>
                                            {participants
                                                .filter(
                                                    (p) =>
                                                        (p.roles?.includes('moderator') || p.roles?.includes('host')) &&
                                                        p.username.toLowerCase().includes(participantSearchTerm.toLowerCase()),
                                                )
                                                .map((participant, index) => (
                                                    <ParticipantItem key={`mod-${index}`} participant={participant} />
                                                ))}
                                        </List>
                                    </>
                                )}

                            {/* Regular users section */}
                            {participants.filter(
                                (p) =>
                                    !p.roles?.includes('host') &&
                                    !p.roles?.includes('moderator') &&
                                    p.username.toLowerCase().includes(participantSearchTerm.toLowerCase()),
                            ).length > 0 && (
                                    <>
                                        <Typography variant='subtitle2' sx={{ px: 2, py: 1, color: 'text.secondary', mt: 1 }}>
                                            Participants
                                        </Typography>
                                        <List disablePadding>
                                            {/* Current user first */}
                                            {participants
                                                .filter(
                                                    (p) =>
                                                        p.userID === user.userID &&
                                                        !p.roles?.includes('host') &&
                                                        !p.roles?.includes('moderator') &&
                                                        p.username.toLowerCase().includes(participantSearchTerm.toLowerCase()),
                                                )
                                                .map((participant, index) => (
                                                    <ParticipantItem key={`self-${index}`} participant={participant} />
                                                ))}

                                            {/* Other regular users */}
                                            {participants
                                                .filter(
                                                    (p) =>
                                                        p.userID !== user.userID &&
                                                        !p.roles?.includes('host') &&
                                                        !p.roles?.includes('moderator') &&
                                                        p.username.toLowerCase().includes(participantSearchTerm.toLowerCase()),
                                                )
                                                .map((participant, index) => (
                                                    <ParticipantItem key={`user-${index}`} participant={participant} />
                                                ))}
                                        </List>
                                    </>
                                )}

                            {/* No results message */}
                            {participants.filter((p) => p.username.toLowerCase().includes(participantSearchTerm.toLowerCase())).length === 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                    <Typography variant='body2' color='text.secondary'>
                                        No participants found
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </>
                )}
                <RolesPermissionsModal open={rolesPermissionModal} onClose={closeRolesPermissionModal} />
            </Box>
        </Drawer>
    );
};