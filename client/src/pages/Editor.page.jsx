import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Drawer, Tooltip } from "@mui/material";
import { BackHand, BackHandOutlined, BackHandRounded, ClearRounded, FilterFramesRounded, MoreVert, PlayArrowRounded } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "react-hot-toast";
// importing components
import { LogoWithTitle } from "../components/Logo";
import { SidebarButton } from "../components/Buttons";
import BottomNavigation from "../components/BottomNavigation";
import CustomMenu from "../components/CustomMenu";
import CustomMenuItem from "../components/CustomMenuItem";
import ChatSidebar from "../components/ChatSidebar";
import Client from "../components/Client";
import Clients from "../components/Clients";
import Editor from "../components/Editor";
// importing contexts
import { ConfirmationDialogContext } from "../contexts/ConfirmationDialog.context";
// importing utils
import { initSocket } from "../utils/socket";
import { executeCode } from "../utils/api";
// importing themes
import { colors } from "../constants/Themes";
// importing constants
import { ACTIONS } from "../constants/Actions";
import { LANGUAGES, FONTSIZES, INDENTSIZES, TABSIZES } from "../constants/Editor";

const EditorPage = () => {
    const { roomID } = useParams();
    const { openDialog } = useContext(ConfirmationDialogContext);
    const location = useLocation();
    const navigate = useNavigate();

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const [clients, setClients] = useState([]);

    if (!location.state && !location.state?.username && !location.state?.userColor) {
        return <Navigate to="/room" />;
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
            socketRef.current?.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state.username) {
                    toast.success(`${username} joined the room`);
                }
                setClients(clients);
                socketRef.current?.emit(ACTIONS.SYNC_CODE, { socketId, code: codeRef.current });
            });

            // Listeing for disconnected
            socketRef.current?.on(ACTIONS.DISCONNECTED, ({ updatedClients, username }) => {
                toast.success(`${username} left the room`);
                setClients(updatedClients);
            });

            socketRef.current?.on(ACTIONS.TYPING, ({ socketID, username }) => {
                if (socketID !== socketRef.current.id) {
                    setCurrentTyper(username);
                    setTimeout(() => setCurrentTyper(""), 2000);
                }
            });

            socketRef.current?.on(ACTIONS.RAISE_HAND, ({ updatedClients }) => {
                setClients(updatedClients);
            });

            // Listening for message
            socketRef.current?.on(ACTIONS.SEND_MESSAGE, ({ message }) => {
                const chatWindow = document.getElementById("chatWindow");
                const chatDrawer = document.getElementById("chat-drawer");
                let currText = chatWindow.innerHTML;
                currText += message;
                chatWindow.innerHTML = currText;
                chatWindow.scrollTop = chatWindow.scrollHeight;
                if (getComputedStyle(chatDrawer).display === "none") { setUnreadMessages(true) }
            });
        };
        init();
        return () => {
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
            socketRef.current?.off(ACTIONS.SEND_MESSAGE);
            socketRef.current?.off(ACTIONS.TYPING);
            socketRef.current?.off(ACTIONS.RAISE_HAND);
            socketRef.current?.disconnect();
        };
    }, [location.state.username, roomID]);

    const copyRoomID = async () => {
        try {
            await navigator.clipboard.writeText(roomID);
            toast.success("Room ID copied to clipboard");
        } catch (error) { toast.error("Failed to copy Room ID") }
    };

    const leaveRoom = () => {
        openDialog({
            title: "Leave Room",
            message:
                <span>
                    Are you sure you want to leave this meeting? To join again, use the same link.<br />
                    However, please note that any ongoing chat will be missed.<br /><br />
                    Proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Leave", type: "error", color: "white", bgcolor: `${colors["primary-bg"]}`,
            dialogId: 1, rest: { navigate }
        });
    };

    const toggleWhiteboard = () => {
        window.open(`/whiteboard/${roomID}`, "_blank");
    };

    const [handRaised, setHandRaised] = useState(false);
    const raiseHand = () => {
        socketRef.current?.emit(ACTIONS.RAISE_HAND, {
            socketID: socketRef.current.id,
            roomID,
            clients,
            handRaised: handRaised
        });
        setHandRaised(prevHandRaised => !prevHandRaised);
    };

    const editorConsole = document.getElementById("editor-console");
    const inputLabel = document.getElementById("input-label");
    const outputLabel = document.getElementById("output-label");
    const inputClicked = () => {
        editorConsole.placeholder = "Enter your input here";
        editorConsole.value = "";
        editorConsole.disabled = false;
        inputLabel.classList.add("clicked-label");
        outputLabel.classList.remove("clicked-label");
    };
    const outputClicked = () => {
        editorConsole.placeholder = "Your output will appear here. Click 'Run code' to see it";
        editorConsole.value = "";
        editorConsole.disabled = true;
        inputLabel.classList.remove("clicked-label");
        outputLabel.classList.add("clicked-label");
    };

    const [languageIndex, setLanguageIndex] = useState(9);
    const handleLanguageIndexChange = () => {
        setLanguageIndex(document.getElementById("languagesIndexOptions").value);
    };
    const runCode = async () => {
        const input = editorConsole.value;
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
            editorConsole.value = message;
            if (error) {
                editorConsole.style.color = "red";
                toast.error("Code compilation errors");
            } else {
                editorConsole.style.color = "white";
                toast.success("Code compilation complete");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Code compilation unsuccessful");
            editorConsole.style.color = "red";
            editorConsole.value = "Something went wrong, Please check your code and input.";
        }
    };

    // JS for Editor Settings Menu
    const [editorAnchorEl, setEditorAnchorEl] = useState(null);
    const openEditorMenu = Boolean(editorAnchorEl);
    const handleEditorMenuOpen = (event) => { setEditorAnchorEl(event.currentTarget) };
    const handleEditorMenuClose = () => { setEditorAnchorEl(null) };

    const [currentTyper, setCurrentTyper] = useState("");

    // JS for Chat Drawer 
    const [chatDrawerWidth, setChatDrawerWidth] = useState("27.5%");
    const [openChat, setOpenChat] = useState(useMediaQuery("(min-width: 800px)"));
    const mobileScreen = useMediaQuery("(max-width: 800px)");
    useEffect(() => {
        if (mobileScreen) { setOpenChat(false) }
    }, [mobileScreen])

    // JS for Unread Messages
    const [unreadMessages, setUnreadMessages] = useState(false);
    const handleChatDrawerOpen = (drawerWidth) => {
        setChatDrawerWidth(drawerWidth);
        setOpenChat(true)
        setUnreadMessages(false);
    };
    const handleChatDrawerClose = () => { setOpenChat(false) };

    // JS for Chat
    const chatInputField = useRef(null);
    const [chatMessage, setChatMessage] = useState("");
    const sendMessage = () => {
        if (chatMessage.trim() === "") { return }
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
        if (key.keyCode === 13) { sendMessage() }
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

    return (
        <div className="flex flex-col md:flex-row mb-[65px] md:mb-0 select-none">
            {/* Left side-panel */}
            <div className="md:h-screen min-w-64 w-64 pt-2 md:pt-0 pb-2 md:flex md:flex-col justify-between">
                <div className="w-screen md:w-auto flex justify-between md:block text-white">
                    <LogoWithTitle color={`${colors["primary-accent"]["500"]}`} styling="md:mt-3 md:mr-2 !justify-start md:!justify-center" />
                    <hr className="hidden md:block w-[87.5%] mx-auto mt-2 mb-1.5" />
                    <h3 className="hidden md:block text-center">Participants</h3>
                    <div className="hidden md:block px-2 py-1 max-h-[55vh] overflow-y-scroll">
                        {clients.map((client, index) => (
                            <Client key={index} me={location.state.username} username={client.username} userColor={client.userColor} handRaised={client.handRaised} />
                        ))}
                    </div>
                    <div className="mr-2 py-2 flex items-center md:hidden absolute right-0">
                        <Clients clients={clients} me={location.state.username} />
                    </div>
                </div>
                <div className="hidden md:flex flex-col gap-2 items-center p-2">
                    <SidebarButton buttonFunction={runCode} title="Run Code" logo={<PlayArrowRounded />} styling="hidden md:flex xl:hidden text-[#28c244] hover:text-white bg-secondary-bg hover:bg-[#389749]" />
                    <SidebarButton buttonFunction={raiseHand} title="Raise Hand"
                        logo={handRaised ? <BackHand sx={{ transform: "scaleX(-1)" }} /> : <BackHandOutlined sx={{ transform: "scaleX(-1)" }} />}
                        styling={`hidden md:flex xl:hidden ${handRaised ? "text-[#ffc016]" : "text-gray-400"} bg-secondary-bg hover:bg-tertiary-bg`}
                    />
                    <SidebarButton buttonFunction={copyRoomID} title="Copy Room ID" logo={
                        <lord-icon
                            src="https://cdn.lordicon.com/jdsvypqr.json" trigger="loop-on-hover" stroke="bold"
                            colors="primary:#9ca3af,secondary:#9ca3af " style={{ width: "20px", height: "20px" }}
                        />
                    } styling="hidden md:flex xl:hidden text-gray-400 bg-secondary-bg hover:bg-tertiary-bg" />
                    <SidebarButton buttonFunction={toggleWhiteboard} title="Open Whiteboard" logo={<FilterFramesRounded />} styling="text-white bg-secondary-bg hover:bg-tertiary-bg" />
                    <SidebarButton buttonFunction={leaveRoom} title="Leave Room" logo={<ClearRounded />} styling="text-[#ff2d2d] hover:text-white bg-secondary-bg hover:bg-[#f54c4c]" />
                </div>
            </div>
            {/* Editor panel */}
            <div className={`bg-slate-600 w-full ${openChat ? "md:max-w-[calc(72.5%-256px)]" : "md:max-w-[calc(100%-256px)]"} px-2 pb-2 flex flex-col justify-between`}>
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
                    <div className="hidden xl:flex gap-1 justify-center absolute left-1/2 -translate-x-1/2">
                        <SidebarButton buttonFunction={runCode} title="Run" logo={<PlayArrowRounded />} styling="w-auto pl-1 pr-2 text-[#28c244] hover:text-white bg-card-bg hover:bg-[#389749]" />
                        <SidebarButton buttonFunction={copyRoomID} title="Copy Room ID" logo={
                            <lord-icon
                                src="https://cdn.lordicon.com/jdsvypqr.json" trigger="loop-on-hover" stroke="bold"
                                colors="primary:#9ca3af,secondary:#9ca3af " style={{ width: "20px", height: "20px" }}
                            />
                        } styling="w-auto px-2 text-gray-400 bg-card-bg hover:bg-board-bg" />
                        <Tooltip title="Raise Hand">
                            <span>
                                <SidebarButton buttonFunction={raiseHand}
                                    logo={handRaised ? <BackHand sx={{ transform: "scaleX(-1)" }} /> : <BackHandOutlined sx={{ transform: "scaleX(-1)" }} />}
                                    styling={`w-auto px-2 ${handRaised ? "text-[#ffc016]" : "text-gray-400"}  bg-card-bg hover:bg-board-bg`}
                                />
                            </span>
                        </Tooltip>
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
                    socketRef={socketRef} roomID={roomID} username={location.state.username} userColor={location.state.userColor}
                    onCodeChange={(code) => { codeRef.current = code }}
                    languageIndex={languageIndex} fontSize={fontSize} tabSize={tabSize} indentUnit={indentSize}
                />
                <div className="min-h-[calc(45vh-245px)] md:h-[calc(30vh-52.5px)]">
                    <div className="mr-0.5 flex justify-between items-center">
                        <div className="my-2 text-gray-300">
                            <label id="input-label" onClick={inputClicked} className="clicked-label py-1 px-2 mr-1 rounded-md cursor-pointer">Input</label>
                            |
                            <label id="output-label" onClick={outputClicked} className="py-1 px-2 ml-1 rounded-md cursor-pointer">Output</label>
                        </div>
                        {currentTyper &&
                            <p className="text-green-400 flex items-center">
                                <span className="w-24 inline-block text-right truncate">{currentTyper}</span>&nbsp;is typing
                            </p>
                        }
                    </div>
                    <textarea
                        id="editor-console" rows={6} placeholder="Enter your input here"
                        className="inputArea w-full min-h-[calc(100%-30px)] md:h-[calc(100%-40px)] px-2 py-1 text-sm text-white bg-board-bg resize-none outline-none select-all"
                    ></textarea>
                </div>
            </div>
            {/* Right side-panel */}
            <div className="hidden md:block">
                {unreadMessages && <span className="w-2 h-2 mr-1 mt-1 rounded-full border-2 border-yellow-400 absolute right-0 z-20 bg-yellow-600" />}
                <Tooltip title="Show Chat" className="cursor-pointer">
                    <lord-icon
                        src="https://cdn.lordicon.com/wzrwaorf.json" trigger="loop" delay="1000" colors="primary:white,secondary:white"
                        style={{ width: "50px", height: "50px", margin: "0 2px 0 3px", cursor: "pointer", display: openChat && "none" }}
                        onClick={async () => { await handleChatDrawerOpen("27.5%"); chatInputField.current.focus(); }}
                    />
                </Tooltip>
            </div>
            <Drawer
                id="chat-drawer" open={openChat}
                sx={{
                    width: chatDrawerWidth, flexShrink: 0, display: openChat ? "block" : "none",
                    "& .MuiDrawer-paper": { width: chatDrawerWidth, bgcolor: `${colors["secondary-bg"]}` },
                }}
                anchor="right" variant="persistent"
            >
                <ChatSidebar
                    handleChatDrawerClose={handleChatDrawerClose} chatMessage={chatMessage} setChatMessage={setChatMessage} sendMessage={sendMessage}
                    chatInputField={chatInputField} handleChatInput={handleChatInput} chatAnchorEl={chatAnchorEl}
                    openChatMenu={openChatMenu} handleChatMenuOpen={handleChatMenuOpen} handleChatMenuClose={handleChatMenuClose}
                    anonymous={anonymous} handleAnonymousClick={handleAnonymousClick}
                />
            </Drawer>
            <div className="grid grid-cols-2 gap-1 py-2 md:hidden bg-slate-600">
                <div className="col-span-2 w-[95%] flex mx-auto gap-1">
                    <SidebarButton buttonFunction={runCode} title="Run Code" logo={<PlayArrowRounded />} styling="text-[#28c244] hover:text-white bg-secondary-bg hover:bg-[#389749]" />
                    <SidebarButton buttonFunction={copyRoomID} title="Copy Room ID" styling="text-gray-200 bg-secondary-bg hover:bg-primary-bg" />
                </div>
            </div>
            <div className="md:hidden">
                <BottomNavigation
                    leaveRoom={leaveRoom} handleChatDrawerOpen={handleChatDrawerOpen}
                    handRaised={handRaised} raiseHand={raiseHand} toggleWhiteboard={toggleWhiteboard} unreadMessages={unreadMessages}
                />
            </div>
        </div>
    );
}

export default EditorPage;