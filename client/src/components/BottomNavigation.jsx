import { BackHand, BackHandOutlined, CallEndOutlined, ChatOutlined, FilterFramesRounded } from "@mui/icons-material";
// import { CallEndTwoTone, ChatTwoTone, MoreHoriz, MoreVert } from "@mui/icons-material";
import { SidebarButton } from "./Buttons";

const BottomNavigation = ({ leaveRoom, handleChatDrawerOpen, handRaised, raiseHand, toggleWhiteboard, unreadMessages }) => {

    return (
        <>
            <div className="w-full fixed bottom-0 flex justify-center py-1.5 px-4 text-white bg-primary-bg">
                <div className="w-[95%] flex justify-center">
                    <SidebarButton buttonFunction={leaveRoom} title="Leave" logo={<CallEndOutlined />} styling="w-[90%] mx-2 flex-col text-xs bg-[#ff2d2d] text-gray-200" />
                </div>
                <SidebarButton buttonFunction={() => handleChatDrawerOpen("100%")} title="Chat"
                    logo={
                        <div className="relative">
                            <ChatOutlined />
                            {unreadMessages && <span className="w-2.5 h-2.5 -mt-0.5 -mr-0.5 rounded-full border-2 border-yellow-400 absolute right-0 bg-yellow-600" />}
                        </div>
                    } styling="flex-col text-xs text-gray-200" />
                <SidebarButton buttonFunction={raiseHand} title="Raise Hand"
                    logo={handRaised ? <BackHand sx={{ transform: "scaleX(-1)" }} /> : <BackHandOutlined sx={{ transform: "scaleX(-1)" }} />}
                    styling={` ${handRaised ? "text-[#ffc016]" : "text-gray-200"} flex-col text-xs`}
                />
                <SidebarButton buttonFunction={toggleWhiteboard} title="Whiteboard" logo={<FilterFramesRounded />} styling="flex-col text-xs text-gray-200" />
                {/* <SidebarButton buttonFunction={() => console.log("hey")} title="More" logo={<MoreHoriz />} styling="flex-col text-xs text-gray-200" /> */}
            </div>
            {/* 
            <div className="w-full fixed bottom-0 flex justify-center gap-6 px-2 py-3 text-white bg-primary-bg">
                <button className="p-3 flex justify-center items-center rounded-full bg-[#ff2d2d]"><CallEndOutlined /></button>
                <button className="p-3 flex justify-center items-center rounded-full bg-gray-500"><ChatOutlined /></button>
                <button className="p-3 flex justify-center items-center rounded-full bg-gray-500"><BackHandOutlined /></button>
                <button className="p-3 flex justify-center items-center rounded-full bg-gray-500"><FilterFramesRounded /></button>
                <button className="p-3 flex justify-center items-center rounded-full bg-gray-500"><MoreVert /></button>
            </div> 
            */}
        </>
    );
}

export default BottomNavigation;