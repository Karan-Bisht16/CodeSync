import React, { useEffect, useState } from 'react';
// importing icons
import {
    FrontHand as FrontHandIcon,
} from '@mui/icons-material';
// importing data
import { constantsJSON } from '../../../data/constants.data';
// importing types
import { SocketUser } from '@codesync/shared';
// importing contexts
import { useSocketContext } from '../../../contexts/Socket.context';
// importing hooks
import { useNotificationSound } from '../hooks/useNotificationSound';
// importing components
import { GenericNotification } from './GenericNotification';
import { UserAvatars } from '../../../components/UserAvatars';
// importing utils
import { formattedString } from '../../../utils/helpers.util';

export const RaisedHandNotification: React.FC = () => {
    const { transitionDuration } = constantsJSON;

    const { participants } = useSocketContext();

    const playRaisedHandNotification = useNotificationSound('notificationAudioHandRaised');

    const [show, setShow] = useState(false);
    const [raisedHandParticipants, setRaisedHandParticipants] = useState<SocketUser[]>([]);

    useEffect(() => {
        const usersWithRaisedHands = participants.filter(p => p.handRaised);

        if (usersWithRaisedHands.length > 0) {
            setShow(true);
            setRaisedHandParticipants(usersWithRaisedHands);
            playRaisedHandNotification();
        } else {
            setShow(false);
            setTimeout(() => {
                setRaisedHandParticipants([]);
            }, transitionDuration);
        }
    }, [participants]);

    const icon = (
        <FrontHandIcon
            color='primary'
            sx={{
                fontSize: 20,
                animation: 'wave 2400ms ease-in-out infinite',
                '@keyframes wave': {
                    '0%': { transform: 'rotate(0deg)' },
                    '5%': { transform: 'rotate(8deg)' },
                    '10%': { transform: 'rotate(0deg)' },
                    '15%': { transform: 'rotate(0deg)' },
                    '20%': { transform: 'rotate(8deg)' },
                    '25%': { transform: 'rotate(0deg)' },
                },
            }}
        />
    );

    const message =
        raisedHandParticipants.length === 1
            ? `${formattedString(raisedHandParticipants[0].username)} has raised hand`
            : `${raisedHandParticipants.length} participants have raised hands`;

    const avatars = raisedHandParticipants.slice(0, 3).map((user, index) => (
        <UserAvatars
            key={index}
            users={[user]}
            sx={{
                fontSize: '0.875rem',
                color: 'white',
                bgcolor: user.userColor || 'primary.main',
                border: '1px solid',
                borderColor: 'background.paper',
            }}
        />
    ));

    return (
        <GenericNotification
            icon={icon}
            message={message}
            avatars={avatars}
            show={show}
            onDismiss={() => setShow(false)}
        />
    );
};