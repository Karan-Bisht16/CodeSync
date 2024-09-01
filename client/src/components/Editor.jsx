import { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
// importing constants
import { LANGUAGES } from "../constants/Editor";
import { ACTIONS } from "../constants/Actions";

const Editor = ({ socketRef, roomID, onCodeChange, languageIndex, tabSize, indentUnit }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            editorRef.current = CodeMirror.fromTextArea(document.getElementById("realtimeEditor"), {
                mode: { name: "javascript", json: true },
                theme: "dracula",
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                tabSize: 2,
                indentUnit: 2,
                autofocus: true,
            });

            editorRef.current?.on("change", (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== "setValue") {
                    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
                        roomID,
                        code,
                    });
                }
            });
        }
        init();
        // editorRef.current.setOption("value", "// By CodeSync \n")
    }, []);

    useEffect(() => {
        editorRef.current.setOption("indentUnit", indentUnit);
        editorRef.current.setOption("tabSize", tabSize);
    }, [tabSize, indentUnit]);

    useEffect(() => {
        const replacementString = LANGUAGES[languageIndex].boilerPlateCode || "";
        editorRef.current.replaceRange(replacementString, { line: 0, char: 0 }, { line: 0, char: 0 });
    }, [languageIndex]);

    useEffect(() => {
        if (socketRef?.current) {
            socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code != null) {
                    editorRef.current?.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current?.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;