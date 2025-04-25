import React, { ReactNode } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Stack,
} from '@mui/material';
// importing icons
import {
    AdminPanelSettings as HostIcon,
    Close as CloseIcon,
    Person as UserIcon,
    SupervisorAccount as ModeratorIcon,
} from '@mui/icons-material';
// importing components
import { BackDrop } from '../../../components/BackDrop';

type RoleSectionProps = {
    icon: ReactNode,
    title: string,
    permissions: string[],
};

const RoleSection: React.FC<RoleSectionProps> = (props) => {
    const { icon, title, permissions } = props;

    return (
        <Box>
            <Stack direction='row' alignItems='center' spacing={1} mb={1}>
                {icon}
                <Typography variant='h6'>{title}</Typography>
            </Stack>
            <Stack spacing={0.5} ml={4}>
                {permissions.map((perm, i) => (
                    <Typography key={i} variant='body2' color='text.secondary'>
                        • {perm}
                    </Typography>
                ))}
            </Stack>
        </Box>
    );
};

type RolesPermissionsModalProps = {
    open: boolean;
    onClose: () => void;
};

export const RolesPermissionsModal: React.FC<RolesPermissionsModalProps> = (props) => {
    const { open, onClose } = props;

    if (!open) {
        return null;
    }

    return (
        <BackDrop>
            <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6'>
                        Roles & Permissions
                    </Typography>
                    <IconButton size='small' onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <RoleSection
                            icon={<HostIcon color='primary' />}
                            title='Host'
                            permissions={[
                                'Has full control over the room.',
                                'Can admit or reject users.',
                                'Can promote or demote members.',
                                'Can lock or unlock the editor and room.',
                                'Can kick users.',
                                'Automatically rejoins with the same role after disconnect.',
                            ]}
                        />
                        <RoleSection
                            icon={<ModeratorIcon color='primary' />}
                            title='Moderator'
                            permissions={[
                                'Can type if editor access is granted by the host',
                                'Can kick users',
                                'Can lock the room or editor if permitted by the host',
                            ]}
                        />
                        <RoleSection
                            icon={<UserIcon color='primary' />}
                            title='User'
                            permissions={['Can type only if the editor is unlocked for users']}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </BackDrop>
    );
};