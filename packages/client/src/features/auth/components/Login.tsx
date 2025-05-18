import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
} from '@mui/material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing contexts
import { useAuthContext } from '../contexts/Auth.context';
import { useSnackBarContext } from '../../../contexts/SnackBar.context';
import { AuthProviders } from './AuthProviders';

export const Login: React.FC = () => {
    const { emailRegex } = constantsJSON;

    const { openAuthModal, loginViaEmail } = useAuthContext();
    const { openSnackBar } = useSnackBarContext();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const emailFieldRef = useRef<HTMLInputElement>(null);
    const passwordFieldRef = useRef<HTMLInputElement>(null);

    const handleFormDataChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });
    };

    const isFormDataValid = () => {
        if (formData.email.trim().length === 0) {
            emailFieldRef.current?.focus();
            openSnackBar({ status: 'error', message: 'Enter email' });
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            emailFieldRef.current?.focus();
            openSnackBar({ status: 'error', message: 'Provide a valid email' });
            return false;
        }
        if (formData.password.trim().length === 0) {
            passwordFieldRef.current?.focus();
            openSnackBar({ status: 'error', message: 'Enter password' });
            return false;
        }

        return true;
    };

    const handleLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isFormDataValid()) {
            return;
        }

        loginViaEmail(formData);
    };

    return (
        <Box
            component='form'
            sx={{ height: '100%', width: '100%', color: 'text.primary', p: 4, mx: 'auto' }}
            onSubmit={handleLogin}
        >
            <Typography component='h1' variant='h4' gutterBottom>
                Log In
            </Typography>

            <TextField
                id='email'
                label='Email *'
                name='email'
                autoComplete='off'
                variant='outlined'
                margin='normal'
                fullWidth
                value={formData.email}
                onChange={handleFormDataChange}
                inputRef={emailFieldRef}
            />

            <TextField
                id='password'
                label='Password *'
                name='password'
                type='password'
                autoComplete='off'
                variant='outlined'
                margin='normal'
                fullWidth
                value={formData.password}
                onChange={handleFormDataChange}
                inputRef={passwordFieldRef}
            />

            <Button
                type='submit'
                variant='contained'
                fullWidth
                sx={{
                    py: 1.5,
                    mt: 2,
                    mb: 3,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                }}
            >
                Login
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
                    OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <AuthProviders />
        </Box>
    );
};