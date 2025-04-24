import React from 'react';
import {
    Avatar,
    Box
} from '@mui/material';
// importing types
import type { SocketUser } from '@codesync/shared';

type UserAvatarsProps = {
    users: SocketUser[],
    size?: string | number,
    fontSize?: string | number,
    sx?: object,
};

export const UserAvatars: React.FC<UserAvatarsProps> = (props) => {
    const { users, size = 32, fontSize = 20, sx = {} } = props;

    if (users.length === 0) return null;

    if (users.length === 1) {
        return (
            <Avatar
                sx={{
                    height: size,
                    width: size,
                    fontSize: fontSize,
                    color: 'white',
                    bgcolor: users[0].userColor || 'primary.main',
                    border: '2px solid', borderColor: 'text.primary',
                    ...sx
                }}
            >
                {users[0].username.charAt(0).toUpperCase()}
            </Avatar>
        );
    }

    return (
        <Box sx={{ height: size, width: (users.length + 2) * 12, position: 'relative' }}>
            {users.map((user, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        left: `${index * 12}px`,
                        zIndex: 3 - index,
                    }}
                >
                    <Avatar
                        sx={{
                            height: size,
                            width: size,
                            fontSize: fontSize,
                            color: 'white',
                            bgcolor: user.userColor || 'primary.main',
                            border: '2px solid', borderColor: 'text.primary',
                            ...sx
                        }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>
            ))}
        </Box>
    );
};