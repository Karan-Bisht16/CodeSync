import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { LoginModal, SignUpModal } from '../features/auth';

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
                backgroundImage: 'url(assets/img-bg-auth.jpg)',
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

export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(false);

    const openSignUpModal = () => {
        setIsLogin(false);
    };
    const openLoginModal = () => {
        setIsLogin(true);
    };

    return (
        <Grid container sx={{ display: 'flex', height: '100vh', alignItems: 'center', bgcolor: 'background.default' }}>
            {!isLogin && <AuthBackground text='Let’s Get Started!' />}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isLogin
                    ? <LoginModal openSignUpModal={openSignUpModal} />
                    : <SignUpModal openLoginModal={openLoginModal} />
                }
            </Grid>
            {isLogin && <AuthBackground text='Welcome Back' />}
        </Grid>
    );
};