import { useState } from 'react';
// importing features
import { useUserContext } from '../../user';
// importing contexts
import { useSnackBarContext } from '../../../contexts/SnackBar.context';
import { useSocketContext } from '../../../contexts/Socket.context';

export const useUserSettings = () => {
    const { user } = useUserContext();
    const { openSnackBar } = useSnackBarContext();
    const { syncUserInParticipants } = useSocketContext();

    const [username, setUsername] = useState(user.username);
    const [updatingUser, setUpdatingUser] = useState(false);

    const handleUpdateUser = (data: { username?: string; userColor?: string }) => {
        if (updatingUser) return;
        if (!username.trim()) {
            return openSnackBar({
                status: 'error',
                message: 'Enter username',
            });
        }

        setUpdatingUser(true);
        try {
            syncUserInParticipants(data);
            openSnackBar({
                status: 'success',
                message: 'User details updated',
            });
        } catch (error: unknown) {
            console.error(error);
        }
        setUpdatingUser(false);
    };

    const handleInputEnter = (key: React.KeyboardEvent<HTMLInputElement>) => {
        if (key.keyCode === 13) {
            handleUpdateUser({ username });
        }
    };

    return {
        username,
        updatingUser,
        setUsername,
        handleUpdateUser,
        handleInputEnter,
    };
};