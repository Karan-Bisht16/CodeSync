export type Role = 'user' | 'moderator' | 'host';

export type BlockEntry = {
    hostID: string,
    roomID: string,
};

export type User = {
    userID: string,
    username: string,
    userColor: string,
    handRaised: boolean,
    createdAt: number,
    roles: Role[],
    admittedRooms?: string[];

    // To be implemented in future
    blockedBy?: BlockEntry[]
};

export type SocketUser = User & {
    socketID: string;
};

export type Message = {
    sender: SocketUser,
    content: string,
    timestamp: number,
    isAnnouncement?: boolean,
    isPinned?: boolean,
    countsAsUnread?: boolean,
};

export type RoomJoinPolicy = 'open' | 'locked';
export type EditorEditPolicy = 'everyone' | 'host-only' | 'host-and-moderators';

export type Room = {
    roomID: string;
    hostID: string;
    joinPolicy: RoomJoinPolicy;
    // This should be a editor property but given the time constraints and the fact the their exists a one-to-one 
    // relation between room and editor (at the moment) thus I'm moving this property to room
    editPolicy: EditorEditPolicy;
    createdAt: number;
    allowModeratorsRoomLock: boolean;
    allowModeratorsEditLock: boolean;

    // To be implemented in future
    allowRejoin?: 'everyone' | 'host-only' | 'host-and-moderators';
    isArchived?: boolean;
};

export type EditorLanguage = {
    languageNumber: string,
    value: string,
    label: string,
    version: string,
    extension: string,
    boilerPlateCode: string,
    prettierSupport?: boolean,
};

export type Editor = {
    language: EditorLanguage;
    customEditors?: string[];

    // To be implemented in future
    fileID?: string;
    fileName?: string;
    filePath?: string;
    createdAt?: number;
    updatedAt?: number;
    lockedBy?: string; // userID of the locker (for file-level locking)
    isLocked?: boolean;
    versionHistory?: string[]; // or object[] for actual version metadata
};

// To be implemented in future
export type Whiteboard = {
    roomID: string;
    editPolicy: 'everyone' | 'host-only' | 'host-and-moderators';
    customEditors?: string[];
};