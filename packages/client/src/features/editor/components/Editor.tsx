import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { search } from '@codemirror/search';
import { indentWithTab } from '@codemirror/commands';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror, { EditorView, keymap, ViewUpdate } from '@uiw/react-codemirror';
import * as allEditorThemes from '@uiw/codemirror-themes-all';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import {
    Paper,
    Box,
    Typography,
    CircularProgress,
    Stack,
} from '@mui/material';
// importing icons
import {
    People
} from '@mui/icons-material';
// importing types
import type { Extension } from '@uiw/react-codemirror';
// importing features
import { useRoomContext } from '../../room';
import { useSettingsContext } from '../../settings';
import { useUserContext } from '../../user';
// importing contexts
import { useSocketContext } from '../../../contexts/Socket.context';
import { useEditorContext } from '../contexts/Editor.context';
// importing components
import { BackDrop } from '../../../components/BackDrop';
import { LoadingModal } from '../../../components/LoadingModal';
import { SearchWidgetConstructor } from './SearchWidget';
// importing utils
import { peerExtension } from '../../../utils/collab.utils';
import { remoteCaretExtension, setRemotePeersEffect } from '../../../utils/remoteCaret.utils';
import { ToolTip } from '../../../components/ToolTip';

type EditorComponentProps = {
    roomID: string,
};

export const EditorComponent: React.FC<EditorComponentProps> = (props) => {
    const { roomID } = props;

    const {
        socket,
        connected,
        hasJoined,
        doc: initialDocContent,
        version: startVersion,
        participants,
        remotePeers,
        fetchDocument,
        sendCaretUpdate,
        getFormattedCode,
    } = useSocketContext();
    const { user } = useUserContext();
    const { room } = useRoomContext();
    const { settings } = useSettingsContext();
    const { editorRef, setEditorDispatch } = useEditorContext();

    const editorViewRef = useRef<EditorView | null>(null);
    const lastCaretPositionRef = useRef<number | null>(null);

    const editorTheme = (theme: string): keyof typeof allEditorThemes => {
        if (theme in allEditorThemes) {
            return theme as keyof typeof allEditorThemes;
        }
        return 'vscodeDark';
    };

    const editorExtensions = useMemo(() => {
        if (socket) {
            const extensions = [
                basicSetup({
                    tabSize: settings.editorTabSize,
                    lineNumbers: settings.editorLineNumbers,
                    foldGutter: settings.editorFoldGutter,
                    autocompletion: settings.editorAutocompletion,
                    indentOnInput: settings.editorIndentOnInput,
                    closeBrackets: settings.editorCloseBrackets,
                    bracketMatching: settings.editorBracketMatching,
                    allowMultipleSelections: settings.editorAllowMultipleSelections,
                    highlightSelectionMatches: settings.editorHighlightSelectionMatches,
                    dropCursor: settings.editorDropCursor,
                    foldKeymap: settings.editorFoldKeymap,
                    completionKeymap: settings.editorCompletionKeymap,
                    searchKeymap: settings.editorSearchKeymap,
                    closeBracketsKeymap: settings.editorCloseBracketsKeymap,
                    lintKeymap: settings.editorLintKeymap,
                }),
                langs.javascript(),
                keymap.of([indentWithTab]),
                peerExtension(socket, startVersion ?? 0, room, user),
                remoteCaretExtension(),
                search({
                    top: true,
                    createPanel: (view) => {
                        return SearchWidgetConstructor(view, editorViewRef);
                    },
                }),
            ];
            return extensions.filter(Boolean);
        }
    }, [startVersion, settings]);

    const handleCaretUpdate = useCallback((viewUpdate: ViewUpdate) => {
        if (!viewUpdate.selectionSet && !viewUpdate.focusChanged) return;

        const offset = viewUpdate.state.selection.main.head;

        if (lastCaretPositionRef.current !== offset) {
            lastCaretPositionRef.current = offset
            sendCaretUpdate(offset)
        }
    }, [sendCaretUpdate]);

    useEffect(() => {
        if (roomID && connected && hasJoined && initialDocContent === '') {
            fetchDocument();
        }
        // socket, roomID, connected, initialDocContent, hasJoined, initializeSession, fetchDocument
    }, [roomID, connected, hasJoined, initialDocContent]);

    // Effect to register/unregister the dispatch function with the context
    useEffect(() => {
        const view = editorRef.current?.view;
        if (view && setEditorDispatch) {
            const dispatch = (effects: any) => {
                if (editorRef.current?.view && effects) {
                    editorRef.current.view.dispatch({ effects });
                }
            };
            setEditorDispatch(dispatch);

            return () => {
                console.log('EditorComponent: Clearing dispatch function from context');
                setEditorDispatch(null);
            };
        }
    }, [setEditorDispatch, editorRef.current?.view]);

    // Effect to handle applying remote peer updates from context to the editor state field
    useEffect(() => {
        const view = editorRef.current?.view;
        if (view && remotePeers) {
            const peerStatesArray = Object.values(remotePeers);
            view.dispatch({
                effects: setRemotePeersEffect.of(peerStatesArray)
            });
        }
    }, [remotePeers, editorRef.current?.view]);

    if (startVersion === null || initialDocContent === null) {
        return (
            <BackDrop>
                <Paper
                    elevation={4}
                    sx={{
                        width: '450px',
                        maxWidth: '90%',
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Stack spacing={2.5} alignItems='center' sx={{ width: '100%' }}>
                        <Typography variant='h5' component='h1' gutterBottom>
                            Loading Editor
                        </Typography>

                        <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
                            Connecting to room: <strong>{roomID}</strong>
                        </Typography>

                        <Box sx={{ my: 2 }}>
                            <CircularProgress color='primary' size={48} />
                        </Box>

                        {participants.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                    width: 'fit-content',
                                    backgroundColor: 'action.hover',
                                    p: 1.5,
                                    mt: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <People fontSize='small' color='action' />
                                <Typography variant='body2' color='text.secondary'>
                                    {participants.length} participant{participants.length !== 1 ? 's' : ''} currently in room
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            </BackDrop>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', bgcolor: 'background.default' }}>
            {!connected && <LoadingModal text={`Chief we ain't connected.<br />Check your internet connection.`} />}
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                {/* TODO: Implement key bindings */}
                <ToolTip title='(Ctrl + Alt + F)'>
                    <button
                        className='w-full text-center'
                        onClick={getFormattedCode}
                    >
                        Format Code
                    </button>
                </ToolTip>
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        borderRadius: 1,
                        '& .cm-editor': {
                            height: '100%',
                            width: '100%',
                            fontSize: `${settings.editorFontSize}px`,
                        },
                        '& .cm-scroller': {
                            overflow: 'auto',
                        },
                    }}
                >
                    {socket && (
                        <CodeMirror
                            id='codeEditor'
                            ref={editorRef}
                            onCreateEditor={(view) => { editorViewRef.current = view }}
                            className='h-full overflow-auto text-left'
                            autoFocus={true}
                            basicSetup={false}
                            value={initialDocContent}
                            extensions={editorExtensions}
                            theme={allEditorThemes[editorTheme(settings.editorTheme)] as Extension | undefined}
                            onUpdate={handleCaretUpdate}
                        // TODO: editable={hasPermission(user, 'editors', 'edit', editor)}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};