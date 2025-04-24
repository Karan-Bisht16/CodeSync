import type { Socket } from 'socket.io-client';
import type { StateEffect } from '@uiw/react-codemirror';
import type { Message, Role, Room, SocketUser } from '@codesync/shared';
import type { ApiResponse } from './API.types';
import type { RemotePeerState } from '../utils/remoteCaret.utils';

export type SessionInitializedEvent = {
    initializedUser: SocketUser,
    room: Room,
};

export type HostSessionInitializedEvent = SessionInitializedEvent & {
    participants: SocketUser[],
};

export type UserJoinRequestedEvent = {
    newUser: SocketUser,
};

export type ResolveJoinRequestArgs = {
    user: SocketUser,
    accept: boolean,
};

export type JoinRequestResponseEvent = {
    user: SocketUser,
    accept: boolean,
    room?: Room,
};

export type UserRequestProcessedEvent = {
    user: SocketUser,
};

export type JoinedEvent = {
    updatedParticipants: SocketUser[],
    joinedUser: SocketUser,
    room: Room,
};

export type DisconnectedEvent = {
    updatedParticipants: SocketUser[],
    disconnectedUser: SocketUser,
};

export type HandRaisedEvent = {
    updatedUser: SocketUser,
    updatedParticipants: SocketUser[],
};

export type ReceiveMessageEvent = {
    newMessage: Message,
};

export type CaretMovedEvent = {
    user: SocketUser,
    offset: number,
    userDisconnected?: boolean,
};

export type UserUpdatedEvent = {
    updatedUser: SocketUser,
    updatedParticipants: SocketUser[],
    isUsernameUpdated: boolean,
    oldUsername: string,
};

export type UpdateUserEvent = {
    updatedUser: SocketUser,
};

export type SendMessageArgs = {
    message: string,
    isAnnouncement?: boolean,
    countsAsUnread?: boolean,
};

export type RoleChangedEvent = {
    newUser: SocketUser,
    updatedParticipants: SocketUser[],
    broadcastMessage: string,
    personalMessage: string,
};

export type AssignRoleArgs = {
    targetUser: SocketUser,
    role: Role,
};

export type KickUserArgs = {
    targetUser: SocketUser,
};

export type UserKickedEvent = {
    updatedParticipants: SocketUser[],
    kickedUser: SocketUser,
    actorUser: SocketUser,
};

export type UpdateRoomSettingsArgs = {
    settings: Partial<Room>
};

export type RoomSettingsUpdatedEvent = {
    updatedRoom: Room,
    actorUser: SocketUser,
}

export type SetEditorDispatchArgs = ((effects: StateEffect<any> | readonly StateEffect<any>[]) => void) | null;

export type SyncUserInParticipantsArgs = {
    username?: string,
    userColor?: string,
};

export type SocketContextType = {
    socket: Socket | null,
    connected: boolean,
    hasJoined: boolean,
    messages: Message[],
    participants: SocketUser[],
    doc: string,
    version: number | null,
    remotePeers: Record<string, RemotePeerState>;
    joinRequestQueue: SocketUser[],
    resolveJoinRequest(data: ResolveJoinRequestArgs): void,
    resolveJoinRequestAll(accept: boolean): void,
    fetchDocument(): Promise<void>,
    initializeSession(roomID: string): void,
    leaveRoom(): void,
    raiseHand(): void,
    sendMessage(data: SendMessageArgs): void,
    syncUserInParticipants(data: SyncUserInParticipantsArgs): void,
    assignRole(data: AssignRoleArgs): void,
    kickUser(data: KickUserArgs): void,
    sendCaretUpdate(offset: number): void,
    updateRoomSettings(data: UpdateRoomSettingsArgs): void,
    downloadCode(): void,
    getExecutedCode(): Promise<ApiResponse | void>,
    getFormattedCode(): Promise<void | undefined>,
};