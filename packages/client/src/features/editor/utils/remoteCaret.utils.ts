import { StateField, StateEffect, Transaction } from '@codemirror/state';
import { Decoration, WidgetType, ViewPlugin, ViewUpdate } from '@codemirror/view';
// importing types
import type { DecorationSet } from '@codemirror/view';

class RemoteCaretWidget extends WidgetType {
    constructor(
        readonly id: string,
        readonly color: string,
        readonly name: string
    ) {
        super();
    }

    eq(other: RemoteCaretWidget) {
        return other.id === this.id && other.color === this.color && other.name === this.name;
    }

    toDOM() {
        const customCaret = document.createElement('span');
        customCaret.style.position = 'absolute';
        customCaret.style.width = '0px';
        customCaret.style.height = '16px';
        customCaret.style.borderLeft = `2px solid ${this.color}`;
        customCaret.style.color = '#ffffff';
        customCaret.style.display = 'inline-block';

        const innerSpan = document.createElement('span');
        innerSpan.innerText = this.name;
        innerSpan.title = this.name;
        innerSpan.style.userSelect = 'none';
        innerSpan.style.position = 'absolute';
        innerSpan.style.bottom = '16px';
        innerSpan.style.left = '0';
        innerSpan.style.background = this.color;
        innerSpan.style.padding = '0 4px';
        innerSpan.style.borderRadius = '5px 5px 5px 0';
        innerSpan.style.zIndex = '2147483647';
        innerSpan.style.opacity = '0.95';

        customCaret.appendChild(innerSpan);

        return customCaret;
    }

    ignoreEvent(): boolean {
        return true;
    }
}

export type RemotePeerState = {
    id: string,
    name: string,
    color: string,
    offset: number,
};

export const setRemotePeersEffect = StateEffect.define<RemotePeerState[]>();
export const updateRemotePeerEffect = StateEffect.define<RemotePeerState | { id: string; remove?: boolean }>();
export const remotePeersStateField = StateField.define<RemotePeerState[]>({
    create(): RemotePeerState[] {
        return [];
    },

    update(peers: RemotePeerState[], tr: Transaction): RemotePeerState[] {
        let currentPeers = peers.slice();
        const currentDocLength = tr.newDoc.length;

        for (const effect of tr.effects) {
            if (effect.is(setRemotePeersEffect)) {
                currentPeers = effect.value.filter(p => p.offset >= 0 && p.offset <= currentDocLength);
            } else if (effect.is(updateRemotePeerEffect)) {
                const update = effect.value;
                const existingIndex = currentPeers.findIndex(p => p.id === update.id);

                if ('remove' in update && update.remove) {
                    if (existingIndex > -1) {
                        currentPeers.splice(existingIndex, 1);
                    }
                } else if ('offset' in update) {
                    const clampedOffset = Math.max(0, Math.min(update.offset, currentDocLength)); // Clamp offset
                    const updatedPeer = {
                        ...update,
                        offset: clampedOffset
                    } as RemotePeerState;

                    if (existingIndex > -1) {
                        currentPeers[existingIndex] = { ...currentPeers[existingIndex], ...updatedPeer };
                    } else {
                        if (updatedPeer.name && updatedPeer.color) {
                            currentPeers.push(updatedPeer);
                        }
                    }
                }
            }
        }

        if (tr.docChanged) {
            return currentPeers.map(peer => {
                const newOffset = tr.changes.mapPos(peer.offset, -1);

                return {
                    ...peer,
                    offset: Math.max(0, Math.min(newOffset, currentDocLength))
                };
            }).filter(p => p.offset >= 0 && p.offset <= currentDocLength);
        }

        return currentPeers;
    },
});

const remoteCaretDecoration = (peers: readonly RemotePeerState[], docLength: number): DecorationSet => {
    const decorations = peers
        .filter(peer => peer.offset >= 0 && peer.offset <= docLength)
        .map(peer => {
            const clampedOffset = Math.max(0, Math.min(peer.offset, docLength));
            return Decoration.widget({
                widget: new RemoteCaretWidget(peer.id, peer.color, peer.name),
                side: -1,
            }).range(clampedOffset);
        });

    return Decoration.set(decorations, true);
};

export const showRemoteCarets = ViewPlugin.define(
    (view) => ({
        decorations: remoteCaretDecoration(view.state.field(remotePeersStateField), view.state.doc.length),
        update(update: ViewUpdate) {
            if (
                update.state.field(remotePeersStateField) !== update.startState.field(remotePeersStateField) ||
                update.docChanged ||
                update.viewportChanged
            ) {
                this.decorations = remoteCaretDecoration(update.state.field(remotePeersStateField), update.state.doc.length);
            }
        },
    }),
    {
        decorations: (v) => v.decorations,
    }
);

export const remoteCaretExtension = () => [
    remotePeersStateField,
    showRemoteCarets,
];