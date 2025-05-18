import React, { ReactNode } from 'react';
import {
    IconButton,
    Typography,
    Box,
    Stack,
    Container,
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
            <Container
                maxWidth='sm'
                sx={{
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    p: '0px !important',
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 4,
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h5'>Roles & Permissions</Typography>
                    </Box>
                    <IconButton aria-label='close' color='inherit' edge='end' onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Stack spacing={3} p={2} pb={3}>
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
            </Container>
        </BackDrop>
    );
};