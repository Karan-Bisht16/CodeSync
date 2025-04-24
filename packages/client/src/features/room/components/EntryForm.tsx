import React from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
// importing icons
import {
    Add as CreateNewRoomIcon,
    ContentCopy as CopyRoomIDIcon,
    Login as JoinRoomIcon,
    MeetingRoom as RoomIDIcon,
    Person as UserNameIcon,
} from '@mui/icons-material';
// importing contexts
import { useColorContext } from '../../../contexts/Color.context';
// importing hooks
import { useEntryForm } from '../hooks/useEntryForm';
// importing components
import { ToolTip } from '../../../components/ToolTip';
import { LoadingModal } from '../../../components/LoadingModal';

// TODO: link to login page
type EntryFormProps = {
    fetchedRoomID?: string,
    to?: string,
};

export const EntryForm: React.FC<EntryFormProps> = (props) => {
    const { fetchedRoomID } = props;

    const { palette, theme } = useColorContext();

    const {
        loading,
        formData,
        usernameFieldRef,
        roomIDFieldRef,
        handleFormDataChange,
        handleInputEnter,
        copyRoomID,
        createNewRoom,
        joinRoom,
    } = useEntryForm(props);

    return (
        <>
            {loading && <LoadingModal text='Connecting to server...' />}
            <Paper
                elevation={4}
                sx={{
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${palette[theme]?.background?.paper} 0%, ${palette[theme]?.background?.default} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderRadius: 4,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant='h5' component='h2' gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 2, md: 3 } }}>
                        {fetchedRoomID ? 'Your' : 'Room'} Details
                    </Typography>

                    <FormControl fullWidth sx={{ mb: { xs: 2, md: 3 } }}>
                        <TextField
                            label='Username'
                            variant='outlined'
                            name='username'
                            inputRef={usernameFieldRef}
                            value={formData.username}
                            onKeyUp={handleInputEnter}
                            onChange={handleFormDataChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <UserNameIcon color='primary' />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete='off'
                            placeholder='Enter your display name'
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label='Room ID'
                            variant='outlined'
                            name='roomID'
                            inputRef={roomIDFieldRef}
                            value={formData.roomID}
                            onKeyUp={handleInputEnter}
                            onChange={handleFormDataChange}
                            disabled={fetchedRoomID !== undefined}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <RoomIDIcon color='primary' />
                                    </InputAdornment>
                                ),
                                endAdornment: formData.roomID ? (
                                    <InputAdornment position='end'>
                                        <ToolTip title='Copy room ID'>
                                            <IconButton edge='end' onClick={copyRoomID} size='small'>
                                                <CopyRoomIDIcon fontSize='small' />
                                            </IconButton>
                                        </ToolTip>
                                    </InputAdornment>
                                ) : null,
                            }}
                            autoComplete='off'
                            placeholder='Enter room ID or create a new one'
                        />
                    </FormControl>

                    <Grid container spacing={2}>
                        {!fetchedRoomID &&
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    color='primary'
                                    size='large'
                                    onClick={createNewRoom}
                                    startIcon={<CreateNewRoomIcon />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        borderWidth: 2,
                                    }}
                                >
                                    Create Room
                                </Button>
                            </Grid>
                        }
                        <Grid size={{ xs: 12, sm: fetchedRoomID ? 12 : 6 }}>
                            <Button
                                fullWidth
                                variant='contained'
                                color='primary'
                                size='large'
                                onClick={joinRoom}
                                startIcon={<JoinRoomIcon />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                }}
                            >
                                Join Room
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
};