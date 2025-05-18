import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
} from '@mui/material';
// importing icons
import {
    EmailOutlined as UpdateEmailIcon,
    LockOutlined as UpdatePasswordIcon,
    DeleteOutline as DeleteAccountIcon,
    Google as GoogleIcon,
    Facebook as FacebookIcon,
    GitHub as GitHubIcon,
    EmailRounded as EmailIcon,
} from '@mui/icons-material';
// importing features
import { auth, useAuthContext } from '../features/auth';
import { useUserContext } from '../features/user';
// importing contexts
import { useSnackBarContext } from '../contexts/SnackBar.context';

const authProviderIconMap = {
    'google': { icon: <GoogleIcon />, color: '#DB4437' },
    'facebook': { icon: <FacebookIcon />, color: '#3b5998' },
    'gitHub': { icon: <GitHubIcon />, color: '#000000' },
    'email': { icon: <EmailIcon />, color: '#808080' },
};

export const Profile: React.FC = () => {
    const { deleteAccount, getAuthProvider, updateUserEmail, updateUserPassword } = useAuthContext();
    const { user } = useUserContext();
    const { openSnackBar } = useSnackBarContext();

    const navigate = useNavigate();

    const currentUser = auth.currentUser;
    const provider = getAuthProvider();

    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const currentPasswordFieldRef = useRef<HTMLInputElement | null>(null);
    const newPasswordFieldRef = useRef<HTMLInputElement | null>(null);
    const newEmailFieldRef = useRef<HTMLInputElement | null>(null);

    const [openEmailDialog, setOpenEmailDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleUpdateEmail = async (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (isUpdatingEmail) return;

        if (!currentPassword || currentPassword.trim().length === 0) {
            currentPasswordFieldRef.current?.focus();
            return openSnackBar({ status: 'error', message: 'Enter current password' });
        }

        if (!newEmail || newEmail.trim().length === 0) {
            newEmailFieldRef.current?.focus();
            return openSnackBar({ status: 'error', message: 'Enter new email' });
        }

        setIsUpdatingEmail(true);
        const emailUpdateSuccess = await updateUserEmail({ password: currentPassword, newEmail });

        if (emailUpdateSuccess) {
            setOpenEmailDialog(false);
            setNewEmail('');
            setCurrentPassword('');
        }
        setIsUpdatingEmail(false);
    };

    const handleUpdatePassword = async (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (isUpdatingPassword) return;


        if (!currentPassword || currentPassword.trim().length === 0) {
            currentPasswordFieldRef.current?.focus();
            return openSnackBar({ status: 'error', message: 'Enter current password' });
        }

        if (!newPassword || newPassword.trim().length === 0) {
            newPasswordFieldRef.current?.focus();
            return openSnackBar({ status: 'error', message: 'Enter new password' });
        }

        setIsUpdatingPassword(true);
        const passwordUpdateSuccess = await updateUserPassword({ password: currentPassword, newPassword: newPassword.trim() });

        if (passwordUpdateSuccess) {
            setOpenPasswordDialog(false);
            setNewPassword('');
            setCurrentPassword('');
        }
        setIsUpdatingPassword(false);
    };

    const handleDeleteAccount = async (event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (isDeleting) return;

        if (isEmailProvider && (!currentPassword || currentPassword.trim().length === 0)) {
            currentPasswordFieldRef.current?.focus();
            return openSnackBar({ status: 'error', message: 'Enter password' });
        }

        setIsDeleting(true);
        const deleteAccountSuccess = await deleteAccount(currentPassword);

        if (deleteAccountSuccess) {
            setOpenDeleteDialog(false);
            setCurrentPassword('');
            navigate('/');
        }
        setIsDeleting(false);
    };

    const isEmailProvider = provider === 'email';

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, []);

    if (!currentUser) {
        return;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                position: 'relative',
                color: 'text.primary',
                bgcolor: 'background.default',
                py: { xs: 12, md: 8 },
            }}
        >
            <Container maxWidth='lg'>
                <Typography variant='h4' component='h1' gutterBottom my={3}>
                    Profile
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 3,
                                }}
                            >
                                <Avatar
                                    src={currentUser.photoURL || undefined}
                                    alt={user.username}
                                    sx={{
                                        height: { xs: 48, md: 100 },
                                        width: { xs: 48, md: 100 },
                                        fontSize: { xs: 24, md: 64 },
                                        color: 'primary.contrastText',
                                        bgcolor: 'primary.main',
                                        mb: { xs: 1, md: 2 },
                                    }}
                                >
                                    {user.username[0].toUpperCase()}
                                </Avatar>

                                <Typography variant='h6'>
                                    {user.username}
                                </Typography>

                                <Typography variant='body2' color='text.secondary' gutterBottom>
                                    {currentUser.email}
                                </Typography>

                                {/* TODO: chip color on light mode is not suitable */}
                                {
                                    provider && <Chip
                                        icon={authProviderIconMap[provider].icon}
                                        label={`Signed in with ${provider}`}
                                        size='small'
                                        sx={{ p: '1px 1px 1px 3px', mt: 1, color: 'white', bgcolor: authProviderIconMap[provider].color }}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant='h6'>
                                    Account Settings
                                </Typography>

                                <Divider sx={{ mt: 1, mb: 2 }} />

                                <Stack spacing={2}>
                                    <Button
                                        variant='outlined'
                                        startIcon={<UpdateEmailIcon />}
                                        onClick={() => setOpenEmailDialog(true)}
                                        disabled={!isEmailProvider}
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                    >
                                        Update Email Address
                                    </Button>

                                    <Button
                                        variant='outlined'
                                        startIcon={<UpdatePasswordIcon />}
                                        onClick={() => setOpenPasswordDialog(true)}
                                        disabled={!isEmailProvider}
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                    >
                                        Change Password
                                    </Button>

                                    <Button
                                        variant='outlined'
                                        color='error'
                                        startIcon={<DeleteAccountIcon />}
                                        onClick={() => setOpenDeleteDialog(true)}
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                    >
                                        Delete Account
                                    </Button>
                                </Stack>

                                {!isEmailProvider && (
                                    <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
                                        Some options are disabled because you signed in with {provider}.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Email Update Dialog */}
                <Dialog
                    open={openEmailDialog}
                    component='form'
                    onSubmit={handleUpdateEmail}
                    onClose={() => setOpenEmailDialog(false)}
                >
                    <DialogTitle>Update Email Address</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To update your email address, please enter your current password and new email.
                        </DialogContentText>
                        <TextField
                            label='Current Password *'
                            type='password'
                            value={currentPassword}
                            inputRef={currentPasswordFieldRef}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            variant='outlined'
                            margin='dense'
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label='New Email Address *'
                            variant='outlined'
                            margin='dense'
                            fullWidth
                            value={newEmail}
                            inputRef={newEmailFieldRef}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenEmailDialog(false)}
                            disabled={isUpdatingEmail}
                            variant='outlined'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={!currentPassword || !newEmail || isUpdatingEmail}
                            variant='contained'
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Password Update Dialog */}
                <Dialog
                    open={openPasswordDialog}
                    component='form'
                    onSubmit={handleUpdatePassword}
                    onClose={() => setOpenPasswordDialog(false)}
                >
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To change your password, please enter your current password and new password.
                        </DialogContentText>
                        <TextField
                            label='Current Password *'
                            type='password'
                            value={currentPassword}
                            inputRef={currentPasswordFieldRef}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            variant='outlined'
                            margin='dense'
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label='New Password *'
                            type='password'
                            value={newPassword}
                            inputRef={newPasswordFieldRef}
                            onChange={(e) => setNewPassword(e.target.value)}
                            variant='outlined'
                            margin='dense'
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenPasswordDialog(false)}
                            disabled={isUpdatingPassword}
                            variant='outlined'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={!currentPassword || !newPassword || isUpdatingPassword}
                            variant='contained'
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Account Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    component='form'
                    onSubmit={handleDeleteAccount}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete your account? This action cannot be undone.
                            {isEmailProvider &&
                                <>
                                    <br /><br />
                                    Please enter your password to confirm.
                                </>
                            }
                        </DialogContentText>
                        {isEmailProvider && <TextField
                            label='Password *'
                            type='password'
                            value={currentPassword}
                            inputRef={currentPasswordFieldRef}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            variant='outlined'
                            margin='dense'
                            fullWidth
                            sx={{ mt: 2 }}
                        />}

                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenDeleteDialog(false)}
                            disabled={isDeleting}
                            variant='outlined'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={(isEmailProvider && !currentPassword) || isDeleting}
                            variant='contained'
                            color='error'
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};