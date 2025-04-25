import React from 'react';
import { Grid, IconButton, Typography } from '@mui/material';
// importing icons
import {
    Close as CloseIcon,
} from '@mui/icons-material';
// importing contexts
import { useAuthContext } from '../contexts/Auth.context';
// importing components
import { BackDrop } from './BackDrop';
import { Login } from './Login';
import { Register } from './Register';
// importing assets
import authBgImg from '/assets/img-bg-auth.jpg';

type AuthBackgroundProps = {
    text: string,
};

const AuthBackground: React.FC<AuthBackgroundProps> = (props) => {
    const { text } = props;

    return (
        <Grid
            size={6}
            sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundImage: `url(${authBgImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <Typography
                variant='h3'
                component='h2'
                sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                }}
            >
                {text}
            </Typography>
        </Grid>
    );
};

export const AuthModal: React.FC = () => {
    const { authModal, closeAuthModal } = useAuthContext();

    if (!authModal) {
        return null;
    }

    return (
        <BackDrop>
            <Grid
                container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '90vh',
                    width: '85%',
                    position: 'relative',
                    bgcolor: 'background.paper',
                    boxShadow: 3
                }}
            >
                {authModal === 'register' && <AuthBackground text='Let’s Get Started!' />}
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {authModal === 'register' && <Register />}
                    {authModal === 'login' && <Login />}
                </Grid>
                {authModal === 'login' && <AuthBackground text='Welcome Back' />}
                <IconButton
                    onClick={closeAuthModal}
                    sx={{ position: 'absolute', top: 12, right: 12 }}
                >
                    <CloseIcon />
                </IconButton>
            </Grid>
        </BackDrop>
    );
};