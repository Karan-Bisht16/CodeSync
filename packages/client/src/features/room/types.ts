import type { Dispatch, SetStateAction } from 'react';
import type { Room } from '@codesync/shared';

export type RoomContextType = {
    room: Room,
    isValidRoom(room: Room | undefined): boolean,
    handleRoomChange(data: Room): void,
    isRoomInitialized: boolean,
    clearRoom(): void,
    updatingRoomSettings: boolean,
    setUpdatingRoomSettings: Dispatch<SetStateAction<boolean>>,
};