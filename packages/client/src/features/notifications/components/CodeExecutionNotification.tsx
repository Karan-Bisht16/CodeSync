import React from 'react';
import {
    CircularProgress,
} from '@mui/material';
// importing icons
import {
    Done as DoneIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
// importing hooks
import { useNotificationSound } from '../hooks/useNotificationSound';
// importing components
import { GenericNotification } from './GenericNotification';

export type CodeExecutionState = {
    status: 'waiting' | 'success' | 'error',
    message: string,
};

export type CodeExecutionNotificationProps = {
    state: CodeExecutionState,
    show: boolean,
    onClose(): void,
};
// FIXME: rerendering leads to multiple notifications
export const CodeExecutionNotification: React.FC<CodeExecutionNotificationProps> = (props) => {
    const { state, show, onClose } = props;
    const { status, message } = state;

    const playCodeExecutionFinisedNotification = useNotificationSound('notificationAudioCodeExecutionFinised');

    let icon;
    switch (status) {
        case 'success':
            playCodeExecutionFinisedNotification();
            icon = <DoneIcon sx={{ mr: 0.5 }} />
            break;
        case 'error':
            icon = <ErrorIcon sx={{ mr: 0.5 }} />
            break;
        case 'waiting':
            icon = <CircularProgress size={24} color='primary' sx={{ mr: 0.5 }} />
            break;
        default:
            icon = <ErrorIcon sx={{ mr: 0.5 }} />
    }

    return (
        <GenericNotification
            icon={icon}
            message={message}
            show={show}
            onDismiss={onClose}
        />
    );
};