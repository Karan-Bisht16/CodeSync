import React from 'react';
import { Link as NavigateLink, useLocation } from 'react-router-dom';
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
// importing icons
import {
    Send as SendIcon,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing features
import { useUserContext } from '../../user';
// importing hooks
import { useUserSettings } from '../hooks/useUserSettings';
// importing components
import { ToolTip } from '../../../components/ToolTip';
import { SectionHeading } from './SectionHeading';
import { SectionSubHeading } from './SectionSubHeading';

export const UserSettings: React.FC = () => {
    const { userColors } = constantsJSON;

    const { user } = useUserContext();

    const {
        username,
        updatingUser,
        setUsername,
        handleUpdateUser,
        handleInputEnter,
    } = useUserSettings();

    const location = useLocation();

    if (!location.pathname.startsWith('/editor/')) {
        return null;
    }

    return (
        <Stack spacing={3}>
            <SectionHeading text='User' />
            <Box>
                <SectionSubHeading text='Current Username' />
                <TextField
                    fullWidth
                    autoComplete='off'
                    size='small'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    onKeyUp={handleInputEnter}
                    disabled={updatingUser}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment
                                    position='end'
                                    onClick={() => handleUpdateUser({ username })}
                                    sx={{ color: 'primary.main', cursor: 'pointer' }}
                                >
                                    <ToolTip title='Update username'>
                                        <SendIcon />
                                    </ToolTip>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <Box>
                <SectionSubHeading text='Current User Color' />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {userColors.map((color) => (
                        <Box
                            key={color}
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                bgcolor: color,
                                cursor: 'pointer',
                                border: color === user.userColor ? '2px solid' : 'none',
                                borderColor: color === user.userColor ? 'text.primary' : 'none',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                            onClick={() => handleUpdateUser({ userColor: color })}
                        />
                    ))}
                </Box>
            </Box>

            <Box>
                For more control over your profile <NavigateLink to='/login' style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>log in</NavigateLink>.
            </Box>

            {updatingUser &&
                <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ position: 'absolute', bottom: '16px', right: '16px' }}
                >
                    Updating...
                </Typography>
            }
        </Stack>
    );
};