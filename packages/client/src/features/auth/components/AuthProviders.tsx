import React from 'react';
import { styled } from '@mui/material';
import {
    Box,
    IconButton,
    IconButtonProps,
} from '@mui/material';
// importing icons
import {
    Facebook as FacebookIcon,
    GitHub as GitHubIcon,
    Google as GoogleIcon,
} from '@mui/icons-material';
// importing contexts
import { useAuthContext } from '../contexts/Auth.context';

const StyledProviderButton = styled((props: IconButtonProps) => (
    <IconButton {...props} />
))(({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '50%',
    padding: theme.spacing(1),
}));

export const AuthProviders: React.FC = () => {
    const { signUpWithGoogle, signUpWithFacebook, signUpWithGitHub } = useAuthContext();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <StyledProviderButton onClick={signUpWithGoogle} sx={{ color: '#DB4437' }}>
                <GoogleIcon />
            </StyledProviderButton>

            <StyledProviderButton onClick={signUpWithFacebook} sx={{ color: '#3b5998' }}>
                <FacebookIcon />
            </StyledProviderButton>

            <StyledProviderButton onClick={signUpWithGitHub} sx={{ color: '#ffffff' }}>
                <GitHubIcon />
            </StyledProviderButton>
        </Box>
    );
};