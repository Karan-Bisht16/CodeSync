import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Drawer, MenuItem, Switch, Tooltip } from "@mui/material";
import { ClearRounded, EmojiEmotions, FilterFramesRounded, LogoutRounded, MoreVert, PlayArrowRounded, Settings } from "@mui/icons-material";
// importing components
import { LogoWithTitle } from "../components/Logo";
import { SidebarButton } from "../components/Buttons";
import { LogoInput } from "../components/Inputs";
import CustomMenu from "../components/CustomMenu";
import CustomMenuItem from "../components/CustomMenuItem";
import Client from "../components/Client";
import Editor from "../components/Editor";
// importing contexts
import { ConfirmationDialogContext } from "../contexts/ConfirmationDialog.context";
// importing utils
import { initSocket } from "../utils/socket";
import { executeCode } from "../utils/api";
// importing theme
import { colors } from "../constants/Themes";
// importing constants
import { ACTIONS } from "../constants/Actions";
import { LANGUAGES, FONTSIZES, INDENTSIZES, TABSIZES } from "../constants/Editor";

const chatDrawerWidth = "27.5%";

const EditorPage = () => {
    const { roomID } = useParams();
    const { openDialog } = useContext(ConfirmationDialogContext);
    const location = useLocation();
    const navigate = useNavigate();

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const [clients, setClients] = useState([]);

    if (!location.state && !location.state.username && !location.state.userColor) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current?.on("connect_error", (error) => handleErrors(error));
            socketRef.current?.on("connect_failed", (error) => handleErrors(error));

            const handleErrors = (error) => {
                console.error("Socket error:", error);
                toast.error("Socket connection failed, try again later.");
                navigate("/");
            }

            socketRef.current?.emit(ACTIONS.JOIN, {
                roomID,
                username: location.state.username,
                userColor: location.state.userColor,
            });

            // Listening for joined event
            socketRef.current?.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state.username) {
                        toast.success(`${username} joined the room`);
                    }
                    setClients(clients);
                    socketRef.current?.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listeing for disconnected
            socketRef.current?.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId);
                });
            });

            // Listening for message
            socketRef.current?.on(ACTIONS.SEND_MESSAGE, ({ message }) => {
                const chatWindow = document.getElementById("chatWindow");
                let currText = chatWindow.innerHTML;
                currText += message;
                chatWindow.innerHTML = currText;
                chatWindow.scrollTop = chatWindow.scrollHeight;
            });
        };
        init();
        return () => {
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
            socketRef.current?.off(ACTIONS.SEND_MESSAGE);
            socketRef.current?.disconnect();
        };
    }, [location.state.username, roomID, navigate]);

    const copyRoomID = async () => {
        try {
            await navigator.clipboard.writeText(roomID);
            toast.success("Room ID copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy Room ID");
        }
    };

    const leaveRoom = () => {
        openDialog({
            title: "Leave Room",
            message:
                <span>
                    Are you sure you want to leave this meeting? To join again, use the same link.
                    <br />
                    However, please note that any ongoing chat will be missed.
                    <br /><br />
                    Proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Leave", type: "error", color: "white", bgcolor: `${colors["primary-bg"]}`,
            dialogId: 1, rest: { navigate }
        });
    };

    const toggleWhiteboard = () => {
        window.open(`/whiteboard/${roomID}`, "_blank");
    };

    const inputField = document.getElementById("inputValues");
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");
    const inputClicked = () => {
        inputField.placeholder = "Enter your input here";
        inputField.value = "";
        inputField.disabled = false;
        inputLabel.classList.remove("notClickedLabel");
        inputLabel.classList.add("clickedLabel");
        outputLabel.classList.remove("clickedLabel");
        outputLabel.classList.add("notClickedLabel");
    };
    const outputClicked = () => {
        inputField.placeholder = "Your output will appear here. Click 'Run code' to see it";
        inputField.value = "";
        inputField.disabled = true;
        inputLabel.classList.remove("clickedLabel");
        inputLabel.classList.add("notClickedLabel");
        outputLabel.classList.remove("notClickedLabel");
        outputLabel.classList.add("clickedLabel");
    };

    const [languageIndex, setLanguageIndex] = useState(9);
    const handleLanguageIndexChange = () => {
        setLanguageIndex(document.getElementById("languagesIndexOptions").value);
    };
    const runCode = async () => {
        const input = inputField.value;
        const code = codeRef.current;
        if (!code || code.trim() === "") {
            toast.error("Write some code first");
            return;
        }

        try {
            toast.loading("Running Code...");
            const { message, error } = await executeCode({
                LanguageChoice: LANGUAGES[languageIndex]?.languageNumber,
                Program: code,
                Input: input
            });
            outputClicked();
            toast.dismiss();
            inputField.value = message;
            if (error) {
                inputField.style.color = "red";
                toast.error("Code compilation errors");
            } else {
                inputField.style.color = "white";
                toast.success("Code compilation complete");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Code compilation unsuccessful");
            inputField.style.color = "red";
            inputField.value = "Something went wrong, Please check your code and input.";
        }
    };

    // JS for Editor Settings Menu
    const [editorAnchorEl, setEditorAnchorEl] = useState(null);
    const openEditorMenu = Boolean(editorAnchorEl);
    const handleEditorMenuOpen = (event) => { setEditorAnchorEl(event.currentTarget) };
    const handleEditorMenuClose = () => { setEditorAnchorEl(null) };

    // JS for Chat Drawer 
    const [openChat, setOpenChat] = useState(true);
    const handleChatDrawerOpen = () => { setOpenChat(true) };
    const handleChatDrawerClose = () => { setOpenChat(false) };

    // JS for Chat
    const chatInputField = useRef(null);
    const [chatMessage, setChatMessage] = useState("");
    const sendMessage = () => {
        if (chatMessage.trim() === "") return;
        let message;
        if (anonymous) {
            message =
                `<p class="text-white break-words">
                        <span className="text-gray-400">Anonymous</span>: ${chatMessage}
                    </p>`
        } else {
            message =
                `<p class="text-white break-words">
                        <span style="color: ${location.state.userColor};" >${location.state.username}</span>: ${chatMessage}
                    </p>`
        }
        const chatWindow = document.getElementById("chatWindow");
        let currText = chatWindow.innerHTML;
        currText += message;
        chatWindow.innerHTML = currText;
        chatWindow.scrollTop = chatWindow.scrollHeight;
        socketRef.current?.emit(ACTIONS.SEND_MESSAGE, { roomID, message });
        setChatMessage("");
    };
    const handleChatInput = (key) => {
        if (key.code === "Enter") {
            sendMessage();
        }
    };

    // JS for Chat Settings Menu
    const [chatAnchorEl, setChatAnchorEl] = useState(null);
    const openChatMenu = Boolean(chatAnchorEl);
    const handleChatMenuOpen = (event) => { setChatAnchorEl(event.currentTarget) };
    const handleChatMenuClose = () => { setChatAnchorEl(null) };

    const [anonymous, setAnonymous] = useState(false);
    const handleAnonymousClick = async () => {
        setAnonymous(!anonymous);
        await handleChatMenuClose();
        chatInputField.current.focus();
    };

    // For customization
    const [fontSize, setFontSize] = useState(14);
    const handleFontSizeChange = () => {
        setFontSize(document.getElementById("fontSizesOptions").value);
        handleEditorMenuClose();
    };
    const [indentSize, setIndentSize] = useState(2);
    const handleIndentSizeChange = () => {
        setIndentSize(document.getElementById("indentSizesOptions").value)
        handleEditorMenuClose();
    };
    const [tabSize, setTabSize] = useState(2);
    const handleTabSizeChange = () => {
        setTabSize(document.getElementById("tabSizesOptions").value)
        handleEditorMenuClose();
    };

    useEffect(() => {
        const codeMirror = document.querySelector(".CodeMirror");
        codeMirror.style.cssText = "height: 69vh; overflow-y: scroll; work-break: break-all;"
        codeMirror.style.fontSize = `${fontSize}px`
    }, [fontSize]);

    return (
        <div className="flex select-none">
            {/* Left side-panel */}
            <div className="h-screen min-w-64 w-64 flex flex-col justify-between">
                <div className="text-white">
                    <LogoWithTitle color={`${colors["primary-accent"]["500"]}`} styling="mt-3 mr-2" />
                    <hr className="w-[87.5%] mx-auto mt-2 mb-1.5" />
                    <h3 className="text-center">Participants</h3>
                    <div className="px-2 py-1">
                        {clients.map((client) => (
                            <Client key={client.socketId} me={location.state.username} username={client.username} userColor={client.userColor} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center p-2">
                    <SidebarButton buttonFunction={runCode} title="Run Code" logo={<PlayArrowRounded />} styling="text-[#28c244] hover:text-white bg-secondary-bg hover:bg-[#389749]" />
                    <SidebarButton buttonFunction={copyRoomID} title="Copy Room ID" logo={
                        <lord-icon
                            src="https://cdn.lordicon.com/jdsvypqr.json" trigger="loop-on-hover" stroke="bold"
                            colors="primary:#9ca3af,secondary:#9ca3af " style={{ width: "20px", height: "20px" }}
                        />
                    } styling="text-gray-400 bg-secondary-bg hover:bg-primary-bg" />
                    <SidebarButton buttonFunction={toggleWhiteboard} title="Open Whiteboard" logo={<FilterFramesRounded />} styling="text-white bg-secondary-bg hover:bg-primary-bg" />
                    <SidebarButton buttonFunction={leaveRoom} title="Leave Room" logo={<ClearRounded />} styling="text-[#ff2d2d] hover:text-white bg-secondary-bg hover:bg-[#f54c4c]" />
                </div>
            </div>
            {/* Editor panel */}
            <div className={`bg-slate-600 w-full ${openChat ? "max-w-[calc(72.5%-256px)]" : "max-w-[calc(100%-256px)]"} p-2 flex flex-col justify-between`}>
                <div className="flex justify-between items-center py-0.5">
                    <div className="relative border-b-2 w-48">
                        <select
                            id="languagesIndexOptions" defaultValue={languageIndex} onChange={handleLanguageIndexChange}
                            className="block px-1 py-1.5 w-full text-sm text-white bg-transparent cursor-pointer outline-none"
                        >
                            {LANGUAGES.map(({ label }, index) => (
                                <option key={index} value={index} className="text-sm text-white bg-secondary-bg">{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <CustomMenu
                            tooltip="Editor Settings" anchorEl={editorAnchorEl}
                            openMenu={openEditorMenu} handleOpenMenu={handleEditorMenuOpen} handleCloseMenu={handleEditorMenuClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "right" }}
                            icon={<MoreVert className="text-white" />}
                            children={
                                <div>
                                    <CustomMenuItem title="Font Size" id="fontSizesOptions" value={fontSize} valuesArray={FONTSIZES} handlevalueChange={handleFontSizeChange} />
                                    <CustomMenuItem title="Indent" id="indentSizesOptions" value={indentSize} valuesArray={INDENTSIZES} handlevalueChange={handleIndentSizeChange} />
                                    <CustomMenuItem title="Tab Size" id="tabSizesOptions" value={tabSize} valuesArray={TABSIZES} handlevalueChange={handleTabSizeChange} />
                                </div>
                            } styling={{ color: "white", bgcolor: `${colors["secondary-bg"]}` }}
                        />
                    </div>
                </div>
                <Editor
                    socketRef={socketRef} roomID={roomID}
                    onCodeChange={(code) => { codeRef.current = code }}
                    languageIndex={languageIndex} tabSize={tabSize} indentUnit={indentSize}
                />
                <div className="h-[calc(30vh-52.5px)]">
                    <div className="my-2 text-gray-300">
                        <label id="inputLabel" onClick={inputClicked}
                            className="clickedLabel py-1 px-2 mr-1 rounded-md cursor-pointer"
                        >Input</label>
                        |
                        <label id="outputLabel" onClick={outputClicked}
                            className="notClickedLabel py-1 px-2 ml-1 rounded-md cursor-pointer"
                        >Output</label>
                    </div>
                    <textarea
                        id="inputValues" rows={6}
                        placeholder="Enter your input here"
                        className="inputArea w-full px-2 py-1 text-sm text-white bg-board-bg resize-none outline-none select-all"
                    ></textarea>
                </div>
            </div>
            {/* Right side-panel */}
            <Tooltip title="Show Chat" className="cursor-pointer">
                <lord-icon
                    src="https://cdn.lordicon.com/wzrwaorf.json" trigger="loop" delay="1000"
                    colors="primary:white,secondary:white"
                    style={{ width: "50px", height: "50px", margin: "0 2px 0 3px", cursor: "pointer", display: openChat && "none" }}
                    onClick={handleChatDrawerOpen}
                />
            </Tooltip>
            <Drawer
                sx={{
                    width: chatDrawerWidth, flexShrink: 0,
                    display: openChat ? "block" : "none",
                    "& .MuiDrawer-paper": { width: chatDrawerWidth, bgcolor: `${colors["secondary-bg"]}` },
                }}
                anchor="right" variant="persistent"
                open={openChat}
            >
                <div className="flex items-center justify-start py-[17px] border-b-2 border-white text-white bg-primary-bg">
                    <Tooltip title="Hide Chat">
                        <LogoutRounded onClick={handleChatDrawerClose} className="ml-3 cursor-pointer z-10" />
                    </Tooltip>
                    <p className="w-full absolute text-center text-lg z-0">Live Chat</p>
                </div>
                <div id="chatWindow" className="w-full h-[calc(100vh-100px)] p-2 overflow-y-scroll bg-primary-bg"></div>
                <div className="h-[104px] py-[10px] flex flex-col gap-2 bg-primary-bg">
                    <LogoInput
                        type="text" placeholder="Type your message" value={chatMessage} inputRef={chatInputField}
                        handleChangeFunction={(e) => setChatMessage(e.target.value)} handleKeyUp={handleChatInput}
                        styling="mx-2 p-2" autoComplete="off"
                        logo={
                            <Tooltip title="Disabled">
                                <EmojiEmotions className="mr-2 cursor-pointer text-primary-bg" />
                            </Tooltip>
                        }
                    />
                    <div className="mr-2 flex gap-2 justify-end items-center">
                        <CustomMenu
                            tooltip="Chat Settings" anchorEl={chatAnchorEl}
                            openMenu={openChatMenu} handleOpenMenu={handleChatMenuOpen} handleCloseMenu={handleChatMenuClose}
                            icon={<Settings className="text-white" />}
                            children={
                                <div>
                                    <MenuItem
                                        onClick={() => { handleChatMenuClose(); handleChatDrawerClose(); }}
                                        className="w-52 !text-sm !py-1 flex !justify-between"
                                    >
                                        Hide chat
                                    </MenuItem>
                                    <div className="py-[4px] px-[16px] w-52 text-sm flex justify-between items-center">
                                        Chat Anonymously
                                        <Switch checked={anonymous} size="small" onClick={handleAnonymousClick} />
                                    </div>
                                </div>
                            } styling={{ color: "white", bgcolor: `${colors["secondary-bg"]}` }}
                        />
                        <button
                            onClick={sendMessage}
                            className="uppercase px-2.5 py-1 rounded-md outline-none bg-primary-accent-700 text-white"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

export default EditorPage;