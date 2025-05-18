import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
// importing contexts
import { SettingsContext } from '../../settings/contexts/Settings.context';
// importing types
import type { SelectChangeEvent } from '@mui/material';
import type { ReactCodeMirrorRef, StateEffect } from '@uiw/react-codemirror';
import type { Editor, EditorLanguage } from '@codesync/shared';
import type { ContextChildrenProps } from '../../../types/Context.types';
import type { SetEditorDispatchArgs } from '../../../types/Socket.types';
import type { EditorContextType, EditorOutput, EditorOutputStatus } from '../types';
// importing utils
import { editorLanguages } from '@codesync/shared';

const EditorContext = createContext<EditorContextType>({
    editorRef: { current: null },
    editorDispatchRef: { current: null },
    editor: {} as Editor,
    handleEditorLanguageChange: (_event: SelectChangeEvent) => { },
    editorInput: '',
    handleEditorInputChange: (_event: React.ChangeEvent<HTMLTextAreaElement>) => { },
    editorOutput: { output: '', status: null },
    handleEditorOutputChange: (_data: { output: string, status: EditorOutputStatus }) => { },
    setEditorDispatch: (_dispatchFn: SetEditorDispatchArgs) => { },
});
export const useEditorContext = () => useContext(EditorContext);
export const EditorProvider: React.FC<ContextChildrenProps> = ({ children }) => {

    const { settings } = useContext(SettingsContext);

    // if and when multi file system is implemented then by default 
    // their will be no editor and user will open files and that will set editors
    const [editor, setEditor] = useState<Editor>({
        language: editorLanguages.find((language) => language.value === settings.editorDefaultLanguage) as EditorLanguage,
    });

    const editorRef = useRef<ReactCodeMirrorRef>(null);

    // TODO: get initial editorLanguage from server
    // [SERVER SIDE] if user is host: initial editorLanguage => settings.editorDefaultLanguage
    // [SERVER SIDE] otherwise use the language that is already in room    
    // const [editorLanguage, setEditorLanguage] = useState<string>(settings.editorDefaultLanguage);
    // TODO: need a socket event to sync editorLanguage when changed
    const handleEditorLanguageChange = (event: SelectChangeEvent) => {
        const { value } = event.target;

        const language = editorLanguages.find((language) => language.value === value);
        if (!language) return;

        setEditor((prevEditor) => {
            return { ...prevEditor, language };
        })
    };
    const [editorInput, setEditorInput] = useState<string>('');
    const handleEditorInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setEditorInput(value);
    };
    const [editorOutput, setEditorOutput] = useState<EditorOutput>({
        output: '',
        status: null,
    });
    const handleEditorOutputChange = (data: { output: string, status: EditorOutputStatus }) => {
        const { output, status } = data;
        setEditorOutput({ output, status });
    };

    const editorDispatchRef = useRef<((effects: StateEffect<any> | readonly StateEffect<any>[]) => void) | null>(null);
    const setEditorDispatch = useCallback((dispatchFn: ((effects: StateEffect<any> | readonly StateEffect<any>[]) => void) | null) => {
        editorDispatchRef.current = dispatchFn;
    }, []);

    return (
        <EditorContext.Provider
            value={{
                editor,
                editorRef,
                editorDispatchRef,
                setEditorDispatch,
                handleEditorLanguageChange,
                editorInput,
                handleEditorInputChange,
                editorOutput,
                handleEditorOutputChange,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};