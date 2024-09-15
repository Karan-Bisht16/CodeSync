import { MenuItem, Switch, Tooltip } from "@mui/material";
import { EmojiEmotions, LogoutRounded, Settings } from "@mui/icons-material";
// importing components
import { LogoInput } from "./Inputs";
import CustomMenu from "./CustomMenu";
// importing themes
import { colors } from "../constants/Themes";

const ChatSidebar = (props) => {
    const { handleChatDrawerClose, chatMessage, setChatMessage, chatInputField, handleChatInput, sendMessage } = props;
    const { chatAnchorEl, openChatMenu, handleChatMenuOpen, handleChatMenuClose } = props;
    const { anonymous, handleAnonymousClick } = props;

    return (
        <>
            <div className="flex items-center justify-start py-[17px] border-b-2 border-white text-white bg-primary-bg">
                <Tooltip title="Hide Chat">
                    <LogoutRounded onClick={handleChatDrawerClose} className="ml-3 cursor-pointer z-10" />
                </Tooltip>
                <p className="w-full absolute text-center text-lg z-0">Live Chat</p>
            </div>
            {/* <div id="chatWindow" className="w-full h-[calc(100vh-100px)] p-2 overflow-y-scroll bg-primary-bg"></div> */}
            <div id="chatWindow" className="w-full h-full p-2 overflow-y-scroll bg-primary-bg"></div>
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
        </>
    );
};

export default ChatSidebar;