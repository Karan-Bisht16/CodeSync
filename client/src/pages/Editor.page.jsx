import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ClearRounded, FilterFramesRounded, PlayArrowRounded, Settings } from "@mui/icons-material";
import { Drawer, IconButton, Menu, MenuItem, Switch, Tooltip } from "@mui/material";
import { LogoutRounded, MoreVert } from "@mui/icons-material";
import axios from "axios";
// importing components
import Logo from "../components/Logo";
import { SidebarButton } from "../components/Buttons";
import CustomMenuItem from "../components/CustomMenuItem";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../utils/socket";
import { ConfirmationDialogContext } from "../contexts/ConfirmationDialog.context";
// importing theme
import { colors } from "../constants/Themes";
// importing constants
import { ACTIONS } from "../constants/Actions";
import { LANGUAGES, FONTSIZES, INDENTSIZES, TABSIZES } from "../constants/Editor";

const chatDrawerWidth = "27.5%";

const EditorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomID } = useParams();

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const chatInputField = useRef(null);
    const [clients, setClients] = useState([]);
    const { openDialog } = useContext(ConfirmationDialogContext);

    if (!location.state && !location.state.username && !location.state.userColor) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current?.on("connect_error", (error) => handleErrors(error));
            socketRef.current?.on("connect_failed", (error) => handleErrors(error));

            const handleErrors = (error) => {
                console.log("Socket error:", error);
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
            console.error(error);
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

        toast.loading("Running Code...");

        const encodedParams = new URLSearchParams();
        encodedParams.append("LanguageChoice", LANGUAGES[languageIndex]?.languageNumber);
        encodedParams.append("Program", code);
        encodedParams.append("Input", input);

        const options = {
            method: "POST",
            url: "https://code-compiler.p.rapidapi.com/v2",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                "X-RapidAPI-Host": "code-compiler.p.rapidapi.com",
            },
            data: encodedParams,
        };
        try {
            const response = await axios.request(options);
            let message = response.data.Result;
            let error = false;
            if (message === null) {
                message = response.data.Errors;
                error = true;
            }
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
            if (error.status === 504 && error?.response?.data?.messages === "The request to the API has timed out. Please try again later, or if the issue persists, please contact the API provider") {
                inputField.value = "Timeout exception. Check your code.";
            } else {
                inputField.value = "Something went wrong, Please check your code and input.";
            }
        }
    };

    const sendMessage = (chatMessage) => {
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
    };

    const handleChatInput = (key) => {
        if (key.code === "Enter") {
            const chatInput = document.getElementById("chatInput");
            if (chatInput.value.trim() !== "") {
                sendMessage(chatInput.value.trim());
                chatInput.value = "";
            }
        }
    };

    // JS for Chat Drawer 
    const [openChat, setOpenChat] = useState(true);
    const handleChatDrawerOpen = () => { setOpenChat(true) };
    const handleChatDrawerClose = () => { setOpenChat(false) };

    // JS for Editor Settings Menu
    const [editorAnchorEl, setEditorAnchorEl] = useState(null);
    const openEditorMenu = Boolean(editorAnchorEl);
    const handleEditorMenuClick = (event) => { setEditorAnchorEl(event.currentTarget) };
    const handleEditorMenuClose = () => { setEditorAnchorEl(null) };

    // JS for Chat Settings Menu
    const [chatAnchorEl, setChatAnchorEl] = useState(null);
    const openChatMenu = Boolean(chatAnchorEl);
    const handleChatMenuClick = (event) => { setChatAnchorEl(event.currentTarget) };
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
                    <div className="font-blinker text-primary-accent-500 text-3xl font-semibold flex justify-center items-center mt-3 mr-2">
                        <Logo color={`${colors["primary-accent"]["500"]}`} />
                        &lt; CodeSync &gt;
                    </div>
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
                        <Tooltip title="Editor Settings">
                            <IconButton onClick={handleEditorMenuClick}>
                                <MoreVert
                                    id="basic-editor-button" aria-haspopup="true"
                                    aria-controls={openEditorMenu ? "basic-editor-menu" : undefined}
                                    aria-expanded={openEditorMenu ? "true" : undefined}
                                    className="text-white cursor-pointer"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="basic-editor-menu" anchorEl={editorAnchorEl}
                            open={openEditorMenu} onClose={handleEditorMenuClose}
                            MenuListProps={{ "aria-labelledby": "basic-editor-button" }} elevation={0}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: { color: "white", bgcolor: `${colors["secondary-bg"]}` },
                                },
                            }}
                        >
                            <CustomMenuItem title="Font Size" id="fontSizesOptions" value={fontSize} valuesArray={FONTSIZES} handlevalueChange={handleFontSizeChange} />
                            <CustomMenuItem title="Indent" id="indentSizesOptions" value={indentSize} valuesArray={INDENTSIZES} handlevalueChange={handleIndentSizeChange} />
                            <CustomMenuItem title="Tab Size" id="tabSizesOptions" value={tabSize} valuesArray={TABSIZES} handlevalueChange={handleTabSizeChange} />
                        </Menu>
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
            <IconButton
                color="inherit"
                edge="end"
                onClick={handleChatDrawerOpen}
                sx={[
                    { mr: 0, mt: 1.25, height: "40px", color: "white" },
                    openChat && { display: "none" },
                ]}
            >
                <Tooltip title="Show Chat">
                    <lord-icon
                        src="https://cdn.lordicon.com/wzrwaorf.json"
                        trigger="loop" delay="1000" colors="primary:white,secondary:white"
                        style={{ width: "50px", height: "50px", }}
                    />
                </Tooltip>
            </IconButton>
            <Drawer
                sx={{
                    width: chatDrawerWidth, flexShrink: 0,
                    display: openChat ? "block" : "none",
                    "& .MuiDrawer-paper": { width: chatDrawerWidth, bgcolor: `${colors["secondary-bg"]}` },
                }}
                anchor="right" variant="persistent"
                open={openChat}
            >
                <div className="flex items-center justify-start py-[17px] text-white bg-primary-bg">
                    <Tooltip title="Hide Chat">
                        <LogoutRounded onClick={handleChatDrawerClose} className="ml-3 cursor-pointer z-10" />
                    </Tooltip>
                    <p className="w-full absolute text-center text-lg z-0">Live Chat</p>
                </div>
                <div id="chatWindow" className="w-full h-[calc(100vh-100px)] p-2 overflow-y-scroll bg-primary-bg"></div>
                <div className="h-[104px] py-[10px] flex flex-col gap-2 bg-primary-bg">
                    <input
                        id="chatInput" type="text" placeholder="Type your message"
                        onKeyUp={handleChatInput} autoComplete="off" ref={chatInputField}
                        className="mx-2 p-2 rounded-md outline-primary-accent-500 outline-1 text-primary-accent-800 selection:bg-primary-accent-800 selection:text-white"
                    />
                    <div className="mr-2 flex gap-2 justify-end items-center">
                        <Tooltip title="Chat Settings">
                            <IconButton onClick={handleChatMenuClick}>
                                <Settings
                                    id="basic-chat-button" aria-haspopup="true"
                                    aria-controls={openChatMenu ? "basic-chat-menu" : undefined}
                                    aria-expanded={openChatMenu ? "true" : undefined}
                                    className="text-white cursor-pointer"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="basic-chat-menu" anchorEl={chatAnchorEl}
                            open={openChatMenu} onClose={handleChatMenuClose}
                            MenuListProps={{ "aria-labelledby": "basic-chat-button" }} elevation={0}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: { color: "white", bgcolor: `${colors["secondary-bg"]}` },
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => { handleChatMenuClose(); handleChatDrawerClose(); }}
                                className="w-52 !text-sm !py-1 flex !justify-between"
                            >
                                Hide chat
                            </MenuItem>
                            <MenuItem className="w-52 !text-sm !py-1 flex !justify-between">
                                Chat Anonymously
                                <Switch checked={anonymous} size="small" onClick={handleAnonymousClick} />
                            </MenuItem>
                        </Menu>
                        <button
                            onClick={sendMessage}
                            className="uppercase px-2.5 py-1 rounded-md bg-primary-accent-700 text-white"
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