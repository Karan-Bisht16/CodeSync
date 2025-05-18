// importing types
import type { EditorOutputStatus } from './types';
import type { RemotePeerState } from './utils/remoteCaret.utils';
// importing provider and context
import { EditorProvider, useEditorContext } from './contexts/Editor.context';
// importing components
import { ActivityDock } from './components/ActivityDock';
import { EditorComponent } from './components/Editor';
import { FloatingControls } from './components/FloatingControls';
import { HostControls } from './components/HostControls';
// importing services
import { executeCode, formatCode } from './services';
// importing utils
import { getDocument } from './utils/collab.utils';
import { setRemotePeersEffect, updateRemotePeerEffect } from './utils/remoteCaret.utils';

export {
    ActivityDock,
    EditorComponent,
    EditorOutputStatus,
    EditorProvider,
    executeCode,
    FloatingControls,
    formatCode,
    getDocument,
    HostControls,
    RemotePeerState,
    setRemotePeersEffect,
    updateRemotePeerEffect,
    useEditorContext,
};