import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing features
import { useUserContext } from '../../user';
// importing contexts
import { useMobileContext } from '../../../contexts/Mobile.context';
import { useSnackBarContext } from '../../../contexts/SnackBar.context';
// importing services
import { pingServer } from '../../../services/api.service';

type EntryFormProps = {
    fetchedRoomID?: string,
    to?: string,
};

export const useEntryForm = ({ fetchedRoomID, to }: EntryFormProps) => {
    const { userColors } = constantsJSON;

    const { isMobile } = useMobileContext();
    const { openSnackBar } = useSnackBarContext();
    const { handleUserChange, isLoggedIn, user } = useUserContext();

    const navigate = useNavigate();

    const usernameFieldRef = useRef<HTMLInputElement>(null);
    const roomIDFieldRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        username: isLoggedIn ? user.username : '',
        roomID: fetchedRoomID || '',
    });

    const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value }
        });
    };

    const [loading, setLoading] = useState(false);

    const createNewRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const ID = uuidV4();
        setFormData((prevFormData) => {
            return { ...prevFormData, roomID: ID }
        });
        openSnackBar({
            status: 'success',
            message: 'Created a new room!'
        });
        usernameFieldRef.current?.focus();
    };

    const copyRoomID = async () => {
        if (formData.roomID) {
            try {
                await navigator.clipboard.writeText(formData.roomID);
                openSnackBar({
                    status: 'success',
                    message: 'Room ID copied to clipboard!',
                });
            } catch (err) {
                openSnackBar({
                    status: 'error',
                    message: 'Failed to copy room ID',
                });
            }
        }
    };

    const handleInputEnter = (key: React.KeyboardEvent<HTMLInputElement>) => {
        if (key.keyCode === 13) {
            joinRoom();
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const checkServerAvailibility = async () => {
        // within 2 minutes, try 24 times after every 5 seconds
        for (let i = 0; i < 24; i++) {
            try {
                const response = await pingServer();
                if (response) {
                    const { data } = response;
                    return data.success;
                }
            } catch (error) {
                console.clear();
            }
            await delay(10000);
        }
    };

    const joinRoom = async () => {
        const { username, roomID } = formData;
        if (!username && !roomID) {
            openSnackBar({
                status: 'error',
                message: 'Room ID and username are required'
            });
            return usernameFieldRef.current?.focus();
        }
        if (!roomID.trim()) {
            openSnackBar({
                status: 'error',
                message: 'Room ID is required'
            });
            return roomIDFieldRef.current?.focus();
        }
        if (!username.trim()) {
            openSnackBar({
                status: 'error',
                message: 'Username is required'
            });
            return usernameFieldRef.current?.focus();
        }
        if (roomID.includes('/') || roomID.trim().includes(' ')) {
            openSnackBar({
                status: 'error',
                message: 'Invalid room ID'
            });
            return roomIDFieldRef.current?.focus();
        }
        const userColor = userColors[Math.floor(Math.random() * userColors.length)];
        // set loading screen until server wakes up 
        setLoading(true);
        handleUserChange({
            userID: uuidV4(),
            username,
            userColor,
            handRaised: false,
            roles: [],
            createdAt: Date.now(),
        });
        const response = await checkServerAvailibility();
        if (response) {
            navigate(to ?? `/editor/${roomID}`);
        } else {
            openSnackBar({
                status: 'error',
                message: 'Server is down. Try again in a few moments'
            })
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!isMobile) {
            usernameFieldRef.current?.focus();
        }
    }, []);

    return {
        loading,
        formData,
        usernameFieldRef,
        roomIDFieldRef,
        handleFormDataChange,
        handleInputEnter,
        copyRoomID,
        createNewRoom,
        joinRoom,
    };
};
