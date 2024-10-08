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

const Editor = ({ socketRef, roomID, username, userColor, onCodeChange, languageIndex, fontSize, tabSize, indentUnit }) => {
    const editorRef = useRef(null);

    // const clientCursorStyling = `position: absolute; bottom: 4.65px; left:-4.75px; font-weight: bold; background: white; padding: 0 4px; border-radius: 5px 5px 5px 0; z-index: 2000; opacity: 0.85`;
    // const createElement = (name, color) => {
    //     const customElement = document.createElement("span");
    //     customElement.innerHTML = `<span title=${name} style="${clientCursorStyling}">${name}</span>`;
    //     customElement.style.position = "absolute";
    //     customElement.style.width = '0';
    //     customElement.style.height = '0';
    //     customElement.style.borderLeft = 'thick solid transparent';
    //     customElement.style.borderRight = 'thick solid transparent';
    //     customElement.style.borderTop = 'thick solid #dfdfe1';
    //     customElement.style.transform = 'translateX(-4px)';
    //     customElement.style.color = color;
    //     return customElement;
    // }

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
                        roomID, code,
                    });
                    // isi CODE_CHANGE ke sath xyz is typing dikha do
                }
            });
            // editorRef.current?.on("cursorActivity", () => {
            //     const { line, ch } = editorRef.current?.getCursor();
            //     socketRef.current?.emit(ACTIONS.CURSOR_MOVED, {
            //         roomID, line, ch, username, userColor,
            //     });
            // });
        }
        init();
    }, []);

    useEffect(() => {
        const codeMirror = document.querySelector(".CodeMirror");
        codeMirror.style.fontSize = `${fontSize}px`
        editorRef.current.setOption("indentUnit", indentUnit);
        editorRef.current.setOption("tabSize", tabSize);
    }, [fontSize, tabSize, indentUnit]);

    useEffect(() => {
        const replacementString = "// By CodeSync\n" + LANGUAGES[languageIndex].boilerPlateCode || "";
        // editorRef.current.replaceRange(" ", { line: 0, char: 0 }, { line: 0, char: 0 });
        editorRef.current.setValue(replacementString);
        socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
            roomID, code: replacementString,
        });
    }, [languageIndex]);

    // let clientsObjForBookmarks = {};
    useEffect(() => {
        if (socketRef?.current) {
            socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code != null) {
                    editorRef.current?.setValue(code);
                }
            });
            // socketRef.current?.on(ACTIONS.CURSOR_MOVED, ({ line, ch, username, userColor, left }) => {
            //     if (left) {
            //         const marker = clientsObjForBookmarks[username]["marker"];
            //         delete clientsObjForBookmarks[username];
            //         marker.clear();
            //     } else if (!clientsObjForBookmarks[username]) {
            //         clientsObjForBookmarks[username] = {
            //             position: { line, ch },
            //             element: createElement(username, userColor),
            //         };
            //     } else {
            //         clientsObjForBookmarks[username]["position"] = { line, ch };
            //     }
            //     Object.entries(clientsObjForBookmarks)?.map(client => {
            //         let position = client[1]["position"];
            //         let element = client[1]["element"];

            //         if (position?.line !== undefined || position?.ch !== undefined) {
            //             const marker = editorRef.current?.setBookmark(position, { widget: element });
            //             client[1]["marker"] = marker;
            //         }
            //     });
            // });
        }
        return () => {
            socketRef.current?.off(ACTIONS.CODE_CHANGE);
            // socketRef.current?.off(ACTIONS.CURSOR_MOVED);
        };
    }, [socketRef.current]);

    return (
        <textarea id="realtimeEditor"></textarea>
    );
};

export default Editor;