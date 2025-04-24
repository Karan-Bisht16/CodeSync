import React from 'react';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
// importing icons
import {
    Google as GoogleIcon
} from '@mui/icons-material';

type SignUpProps = {
    openLoginModal(): void,
};

export const SignUpModal: React.FC<SignUpProps> = (props) => {
    const { openLoginModal } = props;

    return (
        <Box sx={{ height: '100%', width: '100%', color: 'text.primary', bgcolor: 'background.default', p: 4, mx: 'auto' }}>
            <Typography component='h1' variant='h4' gutterBottom>
                Create Account
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        id='firstName'
                        label='First name'
                        name='firstName'
                        autoComplete='off'
                        variant='outlined'
                        required
                        fullWidth
                        margin='normal'
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        id='lastName'
                        label='Last name'
                        name='lastName'
                        autoComplete='off'
                        variant='outlined'
                        required
                        fullWidth
                        margin='normal'
                    />
                </Grid>
            </Grid>

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

            <FormControlLabel
                control={<Checkbox value='terms' color='primary' size='small' />}
                label={<Typography variant='body2'>I agree with terms and Privacy Policy</Typography>}
                sx={{ mt: 1, mb: 2 }}
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
                Create Account
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant='body2' color='text.secondary' sx={{ px: 2 }}>
                    OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Button
                fullWidth
                variant='outlined'
                startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />}
                sx={{
                    py: 1.5,
                    mb: 3,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main' },
                }}
            >
                Sign up with Google
            </Button>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant='body2' color='text.secondary'>
                    Already have an account?{' '}
                    <Typography
                        component='span'
                        variant='body2'
                        color='primary'
                        sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                        onClick={openLoginModal}
                    >
                        Log in
                    </Typography>
                </Typography>
            </Box>
        </Box>
    );
};