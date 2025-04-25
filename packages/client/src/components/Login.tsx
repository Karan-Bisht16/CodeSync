import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton,
} from '@mui/material';
// importing icons
import {
    Apple as AppleIcon,
    Facebook as FacebookIcon,
    Google as GoogleIcon,
    Twitter as TwitterIcon,
} from '@mui/icons-material';
// importing contexts
import { useAuthContext } from '../contexts/Auth.context';

export const Login: React.FC = () => {
    const { openAuthModal } = useAuthContext();

    return (
        <Box sx={{ height: '100%', width: '100%', color: 'text.primary', p: 4, mx: 'auto' }}>
            <Typography component='h1' variant='h4' gutterBottom>
                Login
            </Typography>

            <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email'
                name='email'
                autoComplete='off'
                variant='outlined'
            />

            <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='off'
                variant='outlined'
            />

            <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{
                    py: 1.5,
                    mb: 3,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                }}
            >
                Login in
            </Button>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                    Don't have an account?{' '}
                    <Typography
                        component='span'
                        variant='body2'
                        color='primary'
                        sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                        onClick={() => openAuthModal('register')}
                    >
                        Create account
                    </Typography>
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant='body2' color='text.secondary' sx={{ px: 2 }}>
                    Or continue with
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        p: 1,
                        color: '#DB4437',
                    }}
                >
                    <GoogleIcon />
                </IconButton>
                <IconButton
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        p: 1,
                        color: '#4267B2',
                    }}
                >
                    <FacebookIcon />
                </IconButton>
                <IconButton
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        p: 1,
                        color: '#000000',
                    }}
                >
                    <AppleIcon sx={{ color: 'text.primary' }} />
                </IconButton>
                <IconButton
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        p: 1,
                        color: '#1DA1F2',
                    }}
                >
                    <TwitterIcon />
                </IconButton>
            </Box>
        </Box>
    );
};