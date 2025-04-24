import React, { useEffect, useState } from 'react';
import {
    Switch,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Button,
    Container,
    IconButton,
    Stack,
} from '@mui/material';
// importing icons
import {
    Close as CloseIcon,
} from '@mui/icons-material';
// importing features
import { useRoomContext } from '../../room';
import { useUserContext } from '../../user';
// importing contexts
import { useSocketContext } from '../../../contexts/Socket.context';
// importing components
import { BackDrop } from '../../../components/BackDrop';
// importing utils
import { Room, RoomJoinPolicy } from '@codesync/shared';

type ModeratorControl = 'all' | 'none' | 'custom';

type HostControlSettings = {
    roomLock: RoomJoinPolicy;
    editLock: boolean;
    moderatorControl: ModeratorControl;
    allowModeratorEditLock: boolean;
    allowModeratorRoomLock: boolean;
};

type HostControlsProps = {
    open: boolean;
    onClose(): void;
};

export const HostControls: React.FC<HostControlsProps> = (props) => {
    const { open, onClose } = props;

    const { user } = useUserContext();
    const { updateRoomSettings } = useSocketContext();
    const { room, updatingRoomSettings } = useRoomContext();

    const getModeratorControl = () => {
        return (room.allowModeratorsEditLock && room.allowModeratorsRoomLock)
            ? 'all'
            : ((room.allowModeratorsEditLock || room.allowModeratorsRoomLock)
                ? 'custom'
                : 'none');
    };

    const [roomSettings, setRoomSettings] = useState<HostControlSettings>({
        roomLock: room.joinPolicy,
        editLock: false,
        moderatorControl: getModeratorControl(),
        allowModeratorRoomLock: room.allowModeratorsRoomLock,
        allowModeratorEditLock: room.allowModeratorsEditLock,
    });

    const handleRoomLockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        setRoomSettings((prevRoomSettings) => {
            return {
                ...prevRoomSettings,
                roomLock: checked ? 'locked' : 'open'
            };
        });
    };

    const handleModeratorControlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setRoomSettings((prevRoomSettings) => {
            return {
                ...prevRoomSettings,
                moderatorControl: value as ModeratorControl,
                allowModeratorRoomLock: value === 'all' ? true : (value === 'none' ? false : roomSettings.allowModeratorRoomLock),
                allowModeratorEditLock: value === 'all' ? true : (value === 'none' ? false : roomSettings.allowModeratorEditLock),
            };
        });
    };

    const handleCheckboxHostControls = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setRoomSettings((prevRoomSettings) => {
            return {
                ...prevRoomSettings,
                [name]: checked
            };
        });
    };

    const handleSave = () => {
        if (updatingRoomSettings) return;

        const settings: Partial<Room> = {
            joinPolicy: roomSettings.roomLock,
            allowModeratorsRoomLock: roomSettings.allowModeratorRoomLock,
            allowModeratorsEditLock: roomSettings.allowModeratorEditLock,
        };
        updateRoomSettings({ settings });
    };

    useEffect(() => {
        if (!open) return;

        setRoomSettings({
            roomLock: room.joinPolicy,
            editLock: false,
            moderatorControl: getModeratorControl(),
            allowModeratorRoomLock: room.allowModeratorsRoomLock,
            allowModeratorEditLock: room.allowModeratorsEditLock,
        });
    }, [open, room.joinPolicy, room.allowModeratorsRoomLock, room.allowModeratorsEditLock]);

    if (!open) {
        return null;
    }

    type HostControlsCheckBoxProps = {
        label: string,
        name: string,
        checked: boolean,
        onChange(event: React.ChangeEvent<HTMLInputElement>): void,
        description?: string,
        disabled?: boolean,
    };
    const HostControlsCheckBox: React.FC<HostControlsCheckBoxProps> = (props) => {
        const { label, name, checked, onChange, description, disabled = false } = props;

        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                <Box>
                    <Typography>{label}</Typography>
                    <Typography variant='subtitle1' color='text.secondary' fontSize='small'>{description}</Typography>
                </Box>
                <Switch
                    name={name}
                    disabled={disabled}
                    checked={checked}
                    onChange={onChange}
                />
            </Box>
        );
    };

    return (
        <BackDrop>
            <Container
                maxWidth='lg'
                sx={{
                    height: '70vh',
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    p: '0px !important',
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 4,
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h5'>Host Controls</Typography>
                    </Box>
                    <IconButton aria-label='close' color='inherit' edge='end' onClick={onClose}>
                        <CloseIcon />
                    </IconButton>

                </Box>

                <Box sx={{ display: 'flex', height: 'calc(100% - 72px)', width: '100%', position: 'relative' }}>
                    <Box sx={{ width: '100%', overflow: 'auto' }}>
                        <Stack spacing={3} p={3}>
                            <Typography variant='h6' component='h6' sx={{ mb: 1 }}>
                                Room Settings
                            </Typography>
                            <Stack spacing={1}>
                                <HostControlsCheckBox
                                    label='Room Lock'
                                    name='roomLock'
                                    checked={roomSettings.roomLock === 'locked'}
                                    description='Prevent new users from joining the room.'
                                    onChange={handleRoomLockChange}
                                    disabled={!user.roles?.includes('host') && !roomSettings.allowModeratorRoomLock}
                                />
                                <HostControlsCheckBox
                                    label='Edit Lock'
                                    name='editLock'
                                    checked={roomSettings.editLock}
                                    description='Restrict who can edit the code editor.'
                                    onChange={handleCheckboxHostControls}
                                    disabled={!user.roles?.includes('host') && !roomSettings.allowModeratorEditLock}
                                />
                            </Stack>
                            {user.roles?.includes('host') && (
                                <>
                                    <Typography variant='h6' component='h6' sx={{ mb: 1 }}>
                                        Moderator Controls
                                    </Typography>
                                    <Box>
                                        <Typography variant='body2' color='text.secondary' mb={1}>
                                            Choose what controls moderators can access. <strong>All</strong> gives them full access to room and edit lock settings. <strong>None</strong> restricts them from all host controls. <strong>Custom</strong> lets you choose which specific controls (like edit lock or room lock) they can use.
                                        </Typography>

                                        <RadioGroup
                                            row
                                            value={roomSettings.moderatorControl}
                                            onChange={handleModeratorControlChange}
                                        >
                                            <FormControlLabel value='all' control={<Radio />} label='All' />
                                            <FormControlLabel value='none' control={<Radio />} label='None' />
                                            <FormControlLabel value='custom' control={<Radio />} label='Custom' />
                                        </RadioGroup>

                                        {roomSettings.moderatorControl === 'custom' && (
                                            <Box ml={2}>
                                                <HostControlsCheckBox
                                                    label='Room Lock'
                                                    name='allowModeratorRoomLock'
                                                    checked={roomSettings.allowModeratorRoomLock}
                                                    onChange={handleCheckboxHostControls}
                                                />
                                                <HostControlsCheckBox
                                                    label='Edit Lock'
                                                    name='allowModeratorEditLock'
                                                    checked={roomSettings.allowModeratorEditLock}
                                                    onChange={handleCheckboxHostControls}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Stack>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={handleSave} sx={{ m: 3, mt: 0, px: 4 }}
                            disabled={updatingRoomSettings}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
        </BackDrop>
    );
};