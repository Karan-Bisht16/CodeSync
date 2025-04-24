import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Tldraw } from 'tldraw';
import { useSyncDemo } from '@tldraw/sync';
// importing features
import { EntryForm } from '../features/room';
import { useUserContext } from '../features/user';
import { CollaboratorsPanel } from '../features/whiteboard';
// importing components
import { BackDrop } from '../components/BackDrop';

export const Whiteboard: React.FC = () => {
    const { user, userFetchedFromLocalStorage } = useUserContext();

    const { roomID } = useParams<string>();

    if (!roomID) { return <Navigate to='/room' /> }

    if (!userFetchedFromLocalStorage) {
        return (
            <BackDrop>
                <EntryForm
                    fetchedRoomID={roomID}
                    to={`/whiteboard/${roomID}`}
                />
            </BackDrop>
        );
    }

    const store = useSyncDemo({ roomId: roomID });

    return (
        <div style={{ position: 'fixed', inset: 0 }}>
            <Tldraw
                store={store}
                inferDarkMode
                onMount={(editor) => {
                    editor.user.updateUserPreferences({
                        name: user.username,
                        color: user.userColor,
                    });
                }}
                components={{
                    SharePanel: CollaboratorsPanel,
                }}
            />
        </div>
    );
};