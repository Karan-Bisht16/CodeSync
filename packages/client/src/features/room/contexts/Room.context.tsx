import React, { createContext, useContext, useState } from 'react';
// importing types
import type { Room } from '@codesync/shared';
import type { ContextChildrenProps } from '../../../types/Context.types';
import type { RoomContextType } from '../types';

const RoomContext = createContext<RoomContextType>({
    room: {} as Room,
    isValidRoom: (_room: Room) => { return false },
    handleRoomChange: (_data: Room) => { },
    isRoomInitialized: false,
    clearRoom: () => { },
    updatingRoomSettings: false,
    setUpdatingRoomSettings: () => { },
});
export const useRoomContext = () => useContext(RoomContext);
export const RoomProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const [isRoomInitialized, setIsRoomInitialized] = useState<boolean>(false);
    const [room, setRoom] = useState<Room>({
        roomID: '',
        hostID: '',
        joinPolicy: 'open',
        editPolicy: 'everyone',
        createdAt: Date.now(),
        allowModeratorsEditLock: false,
        allowModeratorsRoomLock: false,
    });
    const [updatingRoomSettings, setUpdatingRoomSettings] = useState<boolean>(false);

    const isValidRoom = (room: Room | undefined) => {
        if (!room) {
            console.warn('No room provided');
            return false;
        }

        const { roomID, hostID, joinPolicy, createdAt } = room;

        const isValidString = (value: unknown): boolean =>
            typeof value === 'string' && value.trim().length > 0;

        const validJoinPolicy = ['open', 'locked'];
        const isJoinPolicyValid = validJoinPolicy.includes(joinPolicy);

        if (!isValidString(roomID)) {
            console.warn('roomID is not a valid string');
            console.warn('roomID: ', roomID);
            return false;
        }
        if (!isValidString(hostID)) {
            console.warn('hostID is not a valid string');
            console.warn('hostID: ', hostID);
            return false;
        }
        if (typeof createdAt !== 'number') {
            console.warn('createdAt is not a number');
            console.warn('createdAt: ', createdAt);
            return false;
        }
        if (!isJoinPolicyValid) {
            console.warn('joinPolicy is not valid');
            console.warn('joinPolicy: ', joinPolicy);
            return false;
        }

        return true;
    };

    const handleRoomChange = (data: Room) => {
        if (!isValidRoom(data)) return;

        setRoom(data);
        setIsRoomInitialized(true);
    };

    const clearRoom = () => {
        setRoom({
            roomID: '',
            hostID: '',
            joinPolicy: 'open',
            editPolicy: 'everyone',
            createdAt: Date.now(),
            allowModeratorsEditLock: false,
            allowModeratorsRoomLock: false,
        });
    };

    return (
        <RoomContext.Provider value={{
            room,
            isValidRoom,
            handleRoomChange,
            isRoomInitialized,
            clearRoom,
            updatingRoomSettings,
            setUpdatingRoomSettings,
        }}>
            {children}
        </RoomContext.Provider>
    );
};