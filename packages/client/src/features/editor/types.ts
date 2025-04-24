import type { SelectChangeEvent } from '@mui/material';
import type { ReactCodeMirrorRef, StateEffect } from '@uiw/react-codemirror';
import type { Editor } from '@codesync/shared';
import type { SetEditorDispatchArgs } from '../../types/Socket.types';

export type EditorOutputStatus = 'success' | 'error' | null;

export type EditorOutput = {
    output: string,
    status: EditorOutputStatus,
};

export type EditorContextType = {
    editorRef: React.RefObject<ReactCodeMirrorRef | null>,
    editorDispatchRef: React.RefObject<((effects: StateEffect<any> | readonly StateEffect<any>[]) => void) | null>,
    editor: Editor,
    handleEditorLanguageChange(event: SelectChangeEvent): void,
    editorInput: string,
    handleEditorInputChange(event: React.ChangeEvent<HTMLTextAreaElement>): void,
    editorOutput: EditorOutput,
    handleEditorOutputChange(data: { output: string, status: EditorOutputStatus }): void,
    setEditorDispatch(dispatchFn: SetEditorDispatchArgs): void;
};