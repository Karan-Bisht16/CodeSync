import { receiveUpdates, sendableUpdates, collab, getSyncedVersion } from '@codemirror/collab';
import { Text, ChangeSet } from '@codemirror/state';
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { Socket } from 'socket.io-client';
// importing types
import type { Update } from '@codemirror/collab';
import type { Room, User } from '@codesync/shared';

export const pushUpdates = async (
    socket: Socket,
    version: number,
    fullUpdates: readonly Update[],
    room: Room,
    user: User,
): Promise<boolean> => {
    const updates = fullUpdates.map((update) => ({
        clientID: update.clientID,
        changes: update.changes.toJSON(),
        effects: update.effects,
    }));

    return new Promise<boolean>((resolve) => {
        socket.emit('PUSH_UPDATES', {
            version,
            updates: JSON.stringify(updates),
            room,
            user
        });
        socket.once('PUSH_UPDATES_RESPONSE', (status: boolean) => {
            resolve(status);
        });
    }).catch(error => {
        console.error('Error in pushUpdates promise:', error);
        return false;
    });
};

export const pullUpdates = async (
    socket: Socket,
    version: number,
    room: Room,
    user: User,
): Promise<readonly Update[]> => {
    return new Promise<Update[]>((resolve) => {
        socket.emit('PULL_UPDATES', {
            version,
            room,
            user,
        });
        socket.once('PULL_UPDATES_RESPONSE', (updates: any) => {
            resolve(JSON.parse(updates));
        });
    }).then((updates: any) =>
        updates.map((update: any) => ({
            changes: ChangeSet.fromJSON(update.changes),
            clientID: update.clientID,
        })),
    ).catch(error => {
        console.error('Error in pullUpdates promise:', error);
        return [];
    });
};

export const getDocument = async (
    socket: Socket,
    room: Room,
    user: User,
): Promise<{ version: number; doc: Text }> => {
    return new Promise<{ version: number; doc: Text }>((resolve) => {
        socket.emit('GET_DOCUMENT', {
            room,
            user,
        });
        socket.once('DOCUMENT_RECEIVED', (data: { version: number, doc: string }) => {
            const { version, doc } = data
            resolve({
                version,
                doc: Text.of(doc.split('\n')),
            })
        });
    }).catch(error => {
        console.error('Error in getDocument promise:', error);
        throw error;
    });
};

export const peerExtension = (
    socket: Socket,
    startVersion: number,
    room: Room,
    user: User,
) => {
    const plugin = ViewPlugin.fromClass(
        class {
            private pushing = false;
            private done = false;

            constructor(private view: EditorView) {
                this.pull();
            }

            update(update: ViewUpdate) {
                if (update.docChanged || update.transactions.length) {
                    this.push();
                }
            }

            async push() {
                const updates = sendableUpdates(this.view.state)
                if (this.pushing || !updates.length) {
                    return;
                }
                this.pushing = true;
                const version = getSyncedVersion(this.view.state);
                await pushUpdates(socket, version, updates, room, user);
                this.pushing = false;
                // Regardless of whether the push failed or new updates came in while it was running, try again if there's updates remaining
                if (sendableUpdates(this.view.state).length) {
                    setTimeout(() => this.push(), 250);
                }
            }

            async pull() {
                while (!this.done) {
                    try {
                        const version = getSyncedVersion(this.view.state);
                        const updates = await pullUpdates(socket, version, room, user);
                        if (updates.length > 0) {
                            this.view.dispatch(receiveUpdates(this.view.state, updates));
                        }
                        // Wait a bit before polling again
                        await new Promise((resolve) => setTimeout(resolve, 250));
                    } catch (error) {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                }
            }

            destroy() {
                this.done = true;
            }
        },
    );

    return [collab({ startVersion }), plugin];
};