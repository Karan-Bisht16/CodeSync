import { Text } from '@codemirror/state';
// importing types
import type { Update } from '@codemirror/collab';
import type { User, Room, SocketUser, Role } from '@codesync/shared';

type Document = {
    updates: Update[],
    doc: Text,
    pending: ((value: any) => void)[],
};

type RoomState = {
    metadata: Room,
    // socketID -> User
    users: Map<string, User>,
    document: Document,
};

export class RoomStore {
    // roomID -> RoomState
    private rooms: Map<string, RoomState> = new Map();
    // socketID -> roomID
    private socketToRoom: Map<string, string> = new Map();
    // roomID -> socketID -> role
    private previousRoles: Map<string, Map<string, Role[]>> = new Map();

    isRoomActive(roomID: string) {
        return this.rooms.has(roomID);
    };

    // TODO: Add boilerplate code [make constants.data.ts in server side with languages]
    createRoom(room: Room): Room {
        // if room doesn't exists then only create new room
        if (!this.isRoomActive(room.roomID)) {
            this.rooms.set(room.roomID, {
                metadata: room,
                users: new Map(),
                document: {
                    updates: [],
                    doc: Text.of(['// Start coding here...']),
                    pending: [],
                },
            });
            return room;
        }
        const roomData = this.rooms.get(room.roomID);

        if (!roomData) {
            throw new Error(`  🔴  Room with ID ${room.roomID} not found.`);
        }
        return roomData.metadata;

    };

    getRoomMetadata(roomID: string): Room | undefined {
        return this.rooms.get(roomID)?.metadata;
    };

    getRoomDoc(roomID: string) {
        return this.rooms.get(roomID)?.document;
    };

    updateRoomDoc(roomID: string, docUpdate: Partial<Document>) {
        const room = this.rooms.get(roomID);
        if (!room) return;

        room.document = {
            ...room.document,
            ...docUpdate,
        };
    };

    updateRoomMetadata(roomID: string, update: Partial<Room>) {
        const room = this.rooms.get(roomID);
        // TODO: check if resultant room is valid
        if (room) {
            room.metadata = { ...room.metadata, ...update };
        }
    };

    getParticipants(roomID: string): SocketUser[] {
        const room = this.rooms.get(roomID);
        if (!room) return [];

        return Array.from(room.users.entries()).map(([socketID, user]) => ({
            socketID,
            ...user,
        }));
    };

    getPreviousRole(roomID: string, userID: string): Role[] | undefined {
        return this.previousRoles.get(roomID)?.get(userID);
    };

    getRoomIDForSocket(socketID: string) {
        return this.socketToRoom.get(socketID);
    };

    getUser(socketID: string): User | undefined {
        const roomID = this.getRoomIDForSocket(socketID);
        return this.rooms.get(roomID!)?.users.get(socketID);
    };

    isUserInRoom(socketID: string, roomID: string) {
        return this.rooms.get(roomID)?.users.get(socketID);
    };

    addUser(roomID: string, socketID: string, user: User) {
        // ensure room exists
        this.createRoom({ ...user, roomID } as unknown as Room);
        const room = this.rooms.get(roomID);
        if (!room) return;

        room.users.set(socketID, user);
        this.socketToRoom.set(socketID, roomID);
    };

    updateUser(socketID: string, user: Partial<User>) {
        const roomID = this.socketToRoom.get(socketID);
        if (!roomID) return;

        const room = this.rooms.get(roomID);
        if (!room) return;

        const existingUser = room.users.get(socketID);
        if (!existingUser) return;

        room.users.set(socketID, { ...existingUser, ...user });
        return room.users.get(socketID);
    };

    removeUser(socketID: string) {
        const roomID = this.socketToRoom.get(socketID);
        if (!roomID) return;

        const room = this.rooms.get(roomID);
        if (!room) return;

        const user = room.users.get(socketID);
        if (user) {
            if (!this.previousRoles.has(roomID)) {
                this.previousRoles.set(roomID, new Map());
            }
            this.previousRoles.get(roomID)!.set(user.userID, user.roles);
        }

        room.users.delete(socketID);
        this.socketToRoom.delete(socketID);

        if (room.users.size === 0) {
            this.rooms.delete(roomID);
            this.previousRoles.delete(roomID);
        }
    };

    getNewHost(roomID: string) {
        const participants = this.getParticipants(roomID);
        const roleWeights = { host: 3, moderator: 2, user: 1 };

        const getHighestRoleWeight = (roles: string[]) => {
            return Math.max(...roles.map(role => roleWeights[role as Role] ?? 0));
        };

        return participants
            .sort((a, b) => {
                const roleDiff = getHighestRoleWeight(b.roles) - getHighestRoleWeight(a.roles);
                if (roleDiff !== 0) return roleDiff;
                return a.createdAt - b.createdAt;
            })[0];
    };
}