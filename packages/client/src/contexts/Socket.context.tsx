import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { debounce } from 'lodash';
// importing types
import type { ApiResponse } from '../types/API.types';
import type { Message, SocketUser } from '@codesync/shared';
import type { ContextChildrenProps } from '../types/Context.types';
import type {
    AssignRoleArgs,
    CaretMovedEvent,
    DisconnectedEvent,
    HandRaisedEvent,
    HostSessionInitializedEvent,
    JoinedEvent,
    JoinRequestResponseEvent,
    KickUserArgs,
    ReceiveMessageEvent,
    ResolveJoinRequestArgs,
    RoleChangedEvent,
    RoomSettingsUpdatedEvent,
    SendMessageArgs,
    SessionInitializedEvent,
    SocketContextType,
    SyncUserInParticipantsArgs,
    UpdateRoomSettingsArgs,
    UpdateUserEvent,
    UserJoinRequestedEvent,
    UserRequestProcessedEvent,
    UserUpdatedEvent,
    UserKickedEvent,
} from '../types/Socket.types';
// importing features
import {
    executeCode,
    formatCode,
    getDocument,
    RemotePeerState,
    setRemotePeersEffect,
    updateRemotePeerEffect,
    useEditorContext
} from '../features/editor';
import { useRoomContext } from '../features/room';
import { useUserContext } from '../features/user';
// importing contexts
import { useModalContext } from './Modal.context';
import { useSnackBarContext } from './SnackBar.context';
// importing utils
import { editorLanguages } from '@codesync/shared';
import { formattedString } from '../utils/helpers.util';

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
    hasJoined: false,
    messages: [],
    participants: [],
    doc: '',
    version: null,
    remotePeers: {},
    joinRequestQueue: [],
    resolveJoinRequest: (_data: ResolveJoinRequestArgs) => { },
    resolveJoinRequestAll: (_accept: boolean) => { },
    fetchDocument: async () => { },
    initializeSession: () => { },
    leaveRoom: () => { },
    raiseHand: () => { },
    sendMessage: (_data: SendMessageArgs) => { },
    syncUserInParticipants: (_data: SyncUserInParticipantsArgs) => { },
    assignRole: (_data: AssignRoleArgs) => { },
    kickUser: (_data: KickUserArgs) => { },
    sendCaretUpdate: (_offset: number) => { },
    updateRoomSettings: (_data: UpdateRoomSettingsArgs) => { },
    downloadCode: () => { },
    getExecutedCode: async (): Promise<ApiResponse | undefined> => { return undefined },
    getFormattedCode: async () => { },
});
export const useSocketContext = () => useContext(SocketContext);
export const SocketProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const { openModal } = useModalContext();
    const { openSnackBar } = useSnackBarContext();
    const { user, isValidUser, handleUserChange } = useUserContext();
    const { room, isValidRoom, handleRoomChange, clearRoom, updatingRoomSettings, setUpdatingRoomSettings } = useRoomContext();
    const {
        editor,
        editorRef,
        editorDispatchRef,
        setEditorDispatch,
        editorInput,
    } = useEditorContext();

    const socketRef = useRef<Socket | null>(null);
    const lastSentCaretRef = useRef<number | null>(null);

    const navigate = useNavigate();

    const [connected, setConnected] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);

    const [doc, setDoc] = useState<string>('');
    const [version, setVersion] = useState<number | null>(null);
    const [remotePeers, setRemotePeers] = useState<Record<string, RemotePeerState>>({});

    const [messages, setMessages] = useState<Message[]>([]);
    const [participants, setParticipants] = useState<SocketUser[]>([]);

    const [joinRequestQueue, setJoinRequestQueue] = useState<SocketUser[]>([]);

    useEffect(() => {
        // Only create the socket once
        if (!socketRef.current) {
            socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                transports: ['websocket', 'polling'],
            });
        }

        const socket = socketRef.current;

        const onConnect = () => {
            console.log('Socket connected with ID:', socket.id);
            setConnected(true);

            // TODO: Re-join logic might be needed here if connection drops/reconnects
            // Attempt re-join automatically
        };

        // TODO: check if any event can be emitted when this function is fired
        const onDisconnect = () => {
            setConnected(false);
            setHasJoined(false);
            setRemotePeers({});
            clearRoom();
            if (editorDispatchRef.current) {
                editorDispatchRef.current(setRemotePeersEffect.of([]));
            }
        };

        const handleErrors = (error: Error) => {
            console.error('Socket error:', error);
            openSnackBar({
                status: 'error',
                message: 'Socket connection failed, try again later.',
            });
            setConnected(false);
            setHasJoined(false);
            setRemotePeers({});
        };

        const onSessionInitialized = (data: SessionInitializedEvent) => {
            if (!data) return;

            const { initializedUser, room } = data;
            console.log('SESSION_INITIALIZED event received:', initializedUser.username);

            handleUserChange(initializedUser);
            console.log('Initailized User: ', initializedUser);

            handleRoomChange(room);
            console.log('Room: ', room);
        };

        const onHostSessionInitialized = (data: HostSessionInitializedEvent) => {
            if (!data) return;

            const { initializedUser, participants, room } = data;
            console.log('HOST_SESSION_INITIALIZED event received for: ', initializedUser.username);
            onSessionInitialized({ initializedUser, room });

            setParticipants(participants);
            setHasJoined(true);
        };

        const onUserJoinRequested = (data: UserJoinRequestedEvent) => {
            if (!data) return;

            const { newUser } = data;
            console.log('USER_JOIN_REQUESTED event received for: ', newUser.username);

            // add user to request queue to show notifications
            setJoinRequestQueue((prevQueue) => {
                if (prevQueue.some((user) => user.userID === newUser.userID)) {
                    return prevQueue;
                }
                return [...prevQueue, newUser];
            });
        };

        const onJoinRequestResponse = (data: JoinRequestResponseEvent) => {
            if (!data) return;

            const { user, accept, room } = data;
            console.log('JOIN_REQUEST_RESPONSE event received for: ', user.username);
            handleUserChange(user);

            if (accept) {
                if (!isValidRoom(room)) return;
                if (!socketRef.current || !socketRef.current.connected) {
                    console.warn('Socket not connected; could not emit JOIN event');
                    return;
                }
                socketRef.current.emit('JOIN', {
                    room,
                    newUser: user,
                });
            } else {
                openModal({
                    isPersistent: true,
                    modalContent: {
                        title: 'Request Rejected',
                        content: 'Your request to join the room was rejected by the host.',
                    },
                    modalButtons: [{
                        label: 'OK',
                        autoFocus: true,
                        variant: 'contained',
                        color: 'primary',
                        onClickFunction: () => navigate('/room'),
                    }]
                });
            }
        };

        const onUserRequestProcessed = (data: UserRequestProcessedEvent) => {
            if (!data) return;

            const { user } = data;
            console.log('USER_REQUEST_PROCESSED event received for: ', user.username);

            // Remove user from queue
            setJoinRequestQueue((prevJoinRequestQueue) => {
                return prevJoinRequestQueue.filter(
                    (request) => request.userID !== user.userID
                );
            });
        };

        const onJoined = (data: JoinedEvent) => {
            if (!data) return;

            const { updatedParticipants, joinedUser } = data;
            console.log('JOINED event received for: ', joinedUser.username);
            setParticipants(updatedParticipants);

            if (joinedUser.userID !== user.userID) {
                openSnackBar({
                    status: 'success',
                    message: `${formattedString(joinedUser.username)} joined the room`,
                });
            } else {
                handleUserChange(joinedUser);
                setHasJoined(true);
            }
        };

        const onDisconnected = (data: DisconnectedEvent) => {
            if (!data) return;

            const { updatedParticipants, disconnectedUser } = data;
            console.log('DISCONNECTED event received:', disconnectedUser.username);
            setParticipants(updatedParticipants);

            setRemotePeers(prev => {
                const newPeers = { ...prev };
                delete newPeers[disconnectedUser.socketID];
                return newPeers;
            });

            // Use updateRemotePeerEffect to remove the specific user
            if (editorDispatchRef.current) {
                editorDispatchRef.current(updateRemotePeerEffect.of({
                    id: disconnectedUser.socketID,
                    remove: true
                }));
            }

            openSnackBar({
                status: 'info',
                message: `${formattedString(disconnectedUser.username)} left the room`,
            });
        };

        const onHandRaised = (data: HandRaisedEvent) => {
            if (!data) return;

            const { updatedUser, updatedParticipants } = data;
            console.log('HAND_RAISED event received for: ', updatedUser.username);
            setParticipants(updatedParticipants);

            if (updatedUser.userID === user.userID) {
                handleUserChange(updatedUser);
                sendMessage({
                    message: `${updatedUser.username} ${updatedUser.handRaised ? 'raised' : 'lowered'} their hand`,
                    isAnnouncement: true,
                    countsAsUnread: false,
                });
            }
        };

        const onMessageReceived = (data: ReceiveMessageEvent) => {
            if (!data) return;

            const { newMessage } = data;
            console.log('MESSAGE_RECEIVED event received');
            setMessages((prevMessages) => {
                return [...prevMessages, newMessage];
            });
        };

        const onUserUpdated = (data: UserUpdatedEvent) => {
            if (!data) return;

            const { updatedUser, updatedParticipants, isUsernameUpdated, oldUsername } = data;
            console.log('USER_UPDATED event received for: ', updatedUser.username);
            setParticipants(updatedParticipants);

            if (isUsernameUpdated) {
                sendMessage({
                    message: `${oldUsername} changed their name to ${updatedUser.username}`,
                    isAnnouncement: true,
                    countsAsUnread: false,
                });
            }
        };

        const onUpdateUser = (data: UpdateUserEvent) => {
            if (!data) return;

            const { updatedUser } = data;
            console.log('UPDATE_USER event received for: ', updatedUser.username);
            handleUserChange(updatedUser);
        };

        const onRoleChanged = (data: RoleChangedEvent) => {
            if (!data) return;

            const { updatedParticipants, newUser, broadcastMessage, personalMessage } = data;
            console.log('ROLE_CHANGED event received for: ', newUser.username);
            setParticipants(updatedParticipants);

            if (newUser.userID === user.userID) {
                handleUserChange(newUser);
                sendMessage({
                    message: broadcastMessage,
                    isAnnouncement: true,
                    countsAsUnread: false,
                });
                openSnackBar({ status: 'success', message: personalMessage });
            } else {
                openSnackBar({ status: 'success', message: broadcastMessage });
            }

        };

        const onUserKicked = (data: UserKickedEvent) => {
            if (!data) return;

            const { updatedParticipants, kickedUser, actorUser } = data;
            console.log('USER_KICKED event received:', kickedUser.username);
            setParticipants(updatedParticipants);

            setRemotePeers(prev => {
                const newPeers = { ...prev };
                delete newPeers[kickedUser.socketID];
                return newPeers;
            });

            // Use updateRemotePeerEffect to remove the specific user
            if (editorDispatchRef.current) {
                editorDispatchRef.current(updateRemotePeerEffect.of({
                    id: kickedUser.socketID,
                    remove: true
                }));
            }

            if (kickedUser.userID === user.userID) {
                handleUserChange(kickedUser);
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }

                setHasJoined(false);
                setDoc('');
                setVersion(null);
                setRemotePeers({});
                setParticipants([]);
                setMessages([]);
                clearRoom();

                editorDispatchRef.current = null;
                lastSentCaretRef.current = null

                openModal({
                    isPersistent: true,
                    modalContent: {
                        title: `You've been kicked`,
                        content: `You were removed from the room by ${actorUser.username}. If you believe this was a mistake, please contact the host.`,
                    },
                    modalButtons: [{
                        label: 'OK',
                        autoFocus: true,
                        variant: 'contained',
                        color: 'primary',
                        onClickFunction: () => navigate('/room'),
                    }]
                });
            } else {
                openSnackBar({
                    status: 'info',
                    message: `${formattedString(kickedUser.username)} was kicked by ${actorUser.username}`,
                });
            }
        };

        const onSyncCaretPosition = (data: CaretMovedEvent) => {
            if (!data) return;

            const { user, offset, userDisconnected = false } = data;
            if (!user || typeof offset === 'undefined') {
                console.warn('Received invalid CARET_MOVED data', data);
                return;
            }

            if (user.socketID === socket.id) return;

            const peerUpdate: RemotePeerState | { id: string, remove: boolean } = userDisconnected || offset < 0
                ? { id: user.socketID, remove: true }
                : {
                    id: user.socketID,
                    name: user.username,
                    color: user.userColor || '#1976d2',
                    offset: offset,
                };

            // Update local state tracking remote peers
            setRemotePeers(prev => {
                const newPeers = { ...prev };
                if ('remove' in peerUpdate && peerUpdate.remove) {
                    delete newPeers[peerUpdate.id];
                } else if ('id' in peerUpdate) { // Check it's not the remove case
                    newPeers[peerUpdate.id] = peerUpdate as RemotePeerState; // Cast needed here
                }
                return newPeers;
            });

            // Dispatch the effect to the CodeMirror editor instance
            if (editorDispatchRef.current) {
                editorDispatchRef.current(updateRemotePeerEffect.of(peerUpdate));
            } else {
                console.warn('Editor dispatch function not available in context to update remote cursor.');
            }
        };

        const onRoomSettingsUpdated = (data: RoomSettingsUpdatedEvent) => {
            if (!data) return;

            const { updatedRoom, actorUser } = data;
            if (!isValidRoom(updatedRoom)) return;

            handleRoomChange(updatedRoom);

            if (actorUser.userID === user.userID) {
                setUpdatingRoomSettings(false);
            }
            openSnackBar({
                status: 'info',
                message: `Room settings were updated by ${actorUser.username}`
            })
        }

        // Event listeners for in-built event
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', handleErrors);
        socket.on('connect_failed', handleErrors);
        socket.on('reconnect_error', handleErrors);
        socket.on('reconnect_failed', handleErrors);
        socket.on('error', handleErrors);
        // Event listeners for custom event
        socket.on('SESSION_INITIALIZED', onSessionInitialized);
        socket.on('HOST_SESSION_INITIALIZED', onHostSessionInitialized);
        socket.on('USER_JOIN_REQUESTED', onUserJoinRequested);
        socket.on('USER_REQUEST_PROCESSED', onUserRequestProcessed);
        socket.on('JOIN_REQUEST_RESPONSE', onJoinRequestResponse);
        socket.on('JOINED', onJoined);
        socket.on('DISCONNECTED', onDisconnected);
        socket.on('HAND_RAISED', onHandRaised);
        socket.on('MESSAGE_RECEIVE', onMessageReceived);
        socket.on('USER_UPDATED', onUserUpdated);
        socket.on('USER_UPDATE_SUCCESS', onUpdateUser);
        socket.on('ROLE_CHANGED', onRoleChanged);
        socket.on('USER_KICKED', onUserKicked);
        socket.on('SYNC_CARET_POSITION', onSyncCaretPosition);
        socket.on('ROOM_SETTINGS_UPDATED', onRoomSettingsUpdated);

        return () => {
            // Cleanup functions for in-built event
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', handleErrors);
            socket.off('connect_failed', handleErrors);
            socket.off('reconnect_error', handleErrors);
            socket.off('reconnect_failed', handleErrors);
            socket.off('error', handleErrors);
            // Cleanup functions for custom event
            socket.off('SESSION_INITIALIZED', onSessionInitialized);
            socket.off('HOST_SESSION_INITIALIZED', onHostSessionInitialized);
            socket.off('USER_JOIN_REQUESTED', onUserJoinRequested);
            socket.off('USER_REQUEST_PROCESSED', onUserRequestProcessed);
            socket.off('JOIN_REQUEST_RESPONSE', onJoinRequestResponse);
            socket.off('JOINED', onJoined);
            socket.off('DISCONNECTED', onDisconnected);
            socket.off('HAND_RAISED', onHandRaised);
            socket.off('MESSAGE_RECEIVE', onMessageReceived);
            socket.off('USER_UPDATED', onUserUpdated);
            socket.off('USER_UPDATE_SUCCESS', onUpdateUser);
            socket.off('ROLE_CHANGED', onRoleChanged);
            socket.off('USER_KICKED', onUserKicked);
            socket.off('SYNC_CARET_POSITION', onSyncCaretPosition);
            socket.off('ROOM_SETTINGS_UPDATED', onRoomSettingsUpdated);
        }
    }, [room.roomID, user.userID, user.username, hasJoined, setEditorDispatch, openSnackBar, openModal]);

    useEffect(() => {
        return () => {
            if (socketRef.current?.connected) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const isSetupComplete = useCallback(() => {
        if (!socketRef.current) {
            console.warn('Socket missing');
            return false;
        }
        if (!socketRef.current.connected) {
            console.warn('Socket is not connected');
            return false;
        }
        if (!isValidUser(user) || !isValidRoom(room)) {
            return false;
        }
        if (!hasJoined) {
            console.warn('User has already joined the room: ', room.roomID);
            return false;
        }
        return true;
    }, [user, room, hasJoined]);

    // Function to initialize session
    const initializeSession = useCallback((roomID: string) => {
        if (!socketRef.current) {
            console.warn('Cannot initialize session: Socket missing');
            return;
        }
        if (!isValidUser(user)) {
            console.warn('Cannot initialize session: Invalid user: ', user);
            return;
        }
        if (hasJoined) {
            console.warn(`Session already initialized for room ${roomID}`);
            return;
        }

        setDoc('');
        setVersion(null);
        setRemotePeers({});
        setParticipants([]);
        setMessages([]);

        socketRef.current!.emit('INITIALIZE_SESSION', {
            roomID,
            newUser: user,
        });
    }, [user, hasJoined]);

    // Function to resolve join request
    const resolveJoinRequest = useCallback((data: ResolveJoinRequestArgs) => {
        if (!isSetupComplete() || !socketRef.current || !data) return;

        const { user, accept } = data;

        socketRef.current.emit('RESOLVE_JOIN_REQUEST', {
            room,
            user,
            accept,
        });
        console.log(`${accept ? 'Accepted' : 'Rejected'} join request for`, user.username);
    }, [room, isSetupComplete]);

    // TODO: Not implemented in backend
    const resolveJoinRequestAll = useCallback((accept: boolean) => {
        if (!isSetupComplete() || !socketRef.current) return;

        socketRef.current.emit('RESOLVE_JOIN_REQUEST_ALL', {
            users: joinRequestQueue,
            room,
            accept,
        });
        console.log(`${accept ? 'Accepted' : 'Rejected'} join request for ${joinRequestQueue.length} users`);

        // Put this in a response handler not be optimistic
        // Remove user from queue; if empty, reset flag
        setJoinRequestQueue([]);
    }, [room, isSetupComplete]);

    // Function to fetch document
    const fetchDocument = useCallback(async () => {
        if (!isSetupComplete() || !socketRef.current) return;

        try {
            const roomID = room.roomID;
            const { version: fetchedVersion, doc: fetchedDoc } = await getDocument(socketRef.current, room, user);
            // Check if still in the same room after async operation
            if (!isSetupComplete() || !socketRef.current) {
                console.warn('Room changed or disconnected while fetching document.');
                return;
            }
            setVersion(fetchedVersion);
            setDoc(fetchedDoc.toString());
            console.log(`Document fetched for room ${roomID}, version: ${fetchedVersion}`);
        } catch (error) {
            console.error('Error fetching document:', error);
            setDoc('');
            setVersion(0);

            openSnackBar({
                status: 'error',
                message: 'Failed to load document. Please try refreshing.',
            });
        }
    }, [room, isSetupComplete, openSnackBar]);

    // Function to leave room
    const leaveRoom = useCallback(() => {
        if (!isSetupComplete() || !socketRef.current) return;

        socketRef.current.disconnect();

        setHasJoined(false);
        setDoc('');
        setVersion(null);
        setRemotePeers({});
        setParticipants([]);
        setMessages([]);
        clearRoom();

        editorDispatchRef.current = null;
        lastSentCaretRef.current = null
        console.log(`Leaving room ${room.roomID}, disconnecting socket.`);

        navigate('/');
    }, [isSetupComplete, navigate]);

    // Function to raise hand in room
    const raiseHand = useCallback(() => {
        if (!isSetupComplete() || !socketRef.current) return;

        const newHandRaisedState = !user.handRaised;

        socketRef.current.emit('RAISE_HAND', {
            room,
            user,
            handRaised: newHandRaisedState
        });
        console.log(`${user.username} ${newHandRaisedState ? 'Raised' : 'lowered'} their hand`);

        handleUserChange({ ...user, handRaised: newHandRaisedState });
    }, [room, user, handleUserChange, isSetupComplete]);

    // Function to send message in room
    const sendMessage = useCallback((data: SendMessageArgs) => {
        if (!isSetupComplete() || !socketRef.current) return;

        const { message, isAnnouncement = false, countsAsUnread = true } = data;
        if (!message?.trim()) return;

        socketRef.current.emit('MESSAGE_SEND', {
            room,
            message,
            sender: user,
            timestamp: Date.now(),
            isAnnouncement,
            countsAsUnread,
        });
    }, [room, user, isSetupComplete]);

    // Function to sync participants if user data changes
    const syncUserInParticipants = useCallback((data: SyncUserInParticipantsArgs) => {
        if (!isSetupComplete() || !socketRef.current) return;
        if (!data) return;

        const { username = user.username, userColor = user.userColor } = data;

        socketRef.current.emit('USER_UPDATE_REQUEST', {
            room,
            user,
            newUsername: username,
            newUserColor: userColor,
        });
    }, [room, user.username, user.userColor, isSetupComplete]);

    const assignRole = useCallback((data: AssignRoleArgs) => {
        if (!isSetupComplete() || !socketRef.current) return;
        if (!data) return;

        const { targetUser, role } = data;
        if (!isValidUser(targetUser)) return;

        socketRef.current.emit('CHANGE_ROLE', {
            room,
            actorUser: user,
            targetUser,
            newRole: role
        });
    }, [room, user, isValidUser, isSetupComplete]);

    const kickUser = useCallback((data: KickUserArgs) => {
        if (!isSetupComplete() || !socketRef.current) return;
        if (!data) return;

        const { targetUser } = data;
        if (!isValidUser(targetUser)) return;

        socketRef.current.emit('KICK_USER', {
            room,
            actorUser: user,
            targetUser,
        });
    }, [room, user, isValidUser, isSetupComplete]);

    // Debounced function to send cursor updates
    const sendCaretUpdate = useCallback(debounce((offset: number) => {
        if (!isSetupComplete() || !socketRef.current) return;

        if (offset < 0) return;
        if (lastSentCaretRef.current === offset) return;

        socketRef.current.emit('CARET_MOVED', {
            room,
            user,
            offset,
        });
        lastSentCaretRef.current = offset;

    }, 300), [room, user, isSetupComplete, debounce]);

    const updateRoomSettings = useCallback((data: UpdateRoomSettingsArgs) => {
        if (!isSetupComplete() || !socketRef.current) return;
        if (!data) return;
        if (updatingRoomSettings) return;

        const { settings } = data;
        setUpdatingRoomSettings(true);

        socketRef.current.emit('UPDATE_ROOM_SETTINGS', {
            room,
            actorUser: user,
            settings,
        });
    }, [room, user, updatingRoomSettings, isSetupComplete]);

    const isEditorSetupComplete = useCallback(() => {
        if (!isSetupComplete() || !socketRef.current) return false;

        if (!editor || !editor.language) {
            openSnackBar({
                status: 'error',
                message: 'No editor language has been selected',
            });
            return false;
        }

        const code = editorRef.current?.view?.state?.doc?.toString()
        if (!code) {
            openSnackBar({
                status: 'error',
                message: 'Please write some code before executing',
            });
            return false;
        }

        return code;
    }, [editor.language, editorLanguages, isSetupComplete, openSnackBar]);

    // Function to download code
    const downloadCode = () => {
        const code = isEditorSetupComplete();
        if (!code) return;
        if (!socketRef.current) return;

        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `codesync-${editor.language.label.toLowerCase()}${editor.language.extension || ''}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Function to get code execution result
    const getExecutedCode = useCallback(async () => {
        const code = isEditorSetupComplete();
        if (!code) return;
        if (!socketRef.current) return;

        const response = await executeCode({
            languageChoice: editor.language.languageNumber,
            program: code,
            input: editorInput,
        });

        return response?.data;
    }, [editorInput, executeCode, isEditorSetupComplete]);

    // TODO: shouldn't be able to format if no edit permission
    // Function to get code formatting result
    const getFormattedCode = useCallback(async () => {
        const code = isEditorSetupComplete();
        if (!code) return;
        if (!socketRef.current) return;

        const response = await formatCode({
            code,
            language: editor.language.label.toLowerCase(),
        });

        if (response) {
            const { data } = response;
            const { data: formattedCode, success, message } = data;
            const editor = editorRef.current?.view;

            if (!editor) {
                openSnackBar({
                    status: 'error',
                    message: 'Something went wrong',
                });
                return;
            }

            openSnackBar({
                status: success ? 'success' : 'error',
                message,
            });

            if (editor && success) {
                editor.dispatch({
                    changes: {
                        from: 0,
                        to: editor.state.doc.length,
                        insert: formattedCode,
                    },
                });
            }
        }
    }, [formatCode, isEditorSetupComplete]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                connected,
                hasJoined,
                messages,
                participants,
                doc,
                version,
                remotePeers,
                joinRequestQueue,
                resolveJoinRequest,
                resolveJoinRequestAll,
                fetchDocument,
                initializeSession,
                leaveRoom,
                raiseHand,
                sendMessage,
                syncUserInParticipants,
                assignRole,
                kickUser,
                sendCaretUpdate,
                updateRoomSettings,
                downloadCode,
                getExecutedCode,
                getFormattedCode,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};