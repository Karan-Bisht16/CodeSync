import { useState } from "react";
import { Global } from "@emotion/react";
import { Avatar, SwipeableDrawer, Tooltip } from "@mui/material";
import { BackHand } from "@mui/icons-material";
// importing components
import Client from "./Client";

const ClientsIcon = ({ clients, socketID }) => {
    const length = clients.length;

    if (length > 0) {
        switch (length) {
            case 1:
                return (
                    <Client socketID={socketID} client={clients[0]} />
                );
            case 2:
                return (
                    <>
                        <Client socketID={socketID} client={clients[0]} styling="relative left-8" />
                        <Client socketID={socketID} client={clients[1]} userColor={clients[1].userColor} />
                    </>
                );
            case 3:
                return (
                    <>
                        <Client socketID={socketID} client={clients[0]} styling="relative left-16" />
                        <Client socketID={socketID} client={clients[1]} userColor={clients[1].userColor} styling="relative left-8" />
                        <Client socketID={socketID} client={clients[2]} userColor={clients[2].userColor} />
                    </>
                );
            default:
                return (
                    <>
                        <Client socketID={socketID} client={clients[0]} styling="relative left-24" />
                        <Client socketID={socketID} client={clients[1]} userColor={clients[1].userColor} styling="relative left-16" />
                        <Client socketID={socketID} client={clients[2]} userColor={clients[2].userColor} styling="relative left-8" />
                        <Client socketID={false} client={{ socketID: false, username: "+", userColor: "#d3d3d3" }} styling="relative left-0" />
                    </>
                );
        }
    }
}

const drawerHeight = 60;
const Clients = ({ clients, socketID }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (newOpen) => () => { setOpenDrawer(newOpen) };

    const avatarStyling = (client) => {
        return {
            width: "32px", height: "32px", bgcolor: client.userColor,
            border: socketID === client.socketID ? "3px solid #00a951" : "1px solid gray",
            boxShadow: socketID === client.socketID && "0 0 5px #00a951",
        };
    };

    return (
        <>
            <Global
                styles={{
                    ".MuiDrawer-root > .MuiPaper-root.MuiPaper-elevation16.MuiDrawer-paperAnchorBottom": {
                        height: `calc(100% - ${drawerHeight}px)`,
                        overflow: "visible",
                    },
                }}
            />
            <div onClick={toggleDrawer(true)} className="flex">
                <ClientsIcon clients={clients} socketID={socketID} />
            </div>
            <SwipeableDrawer
                anchor="bottom" open={openDrawer}
                onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerHeight}
                disableSwipeToOpen={true}
                ModalProps={{ keepMounted: false }}
            >
                <div style={{ top: -drawerHeight }} className="absolute rounded-tl-xl rounded-tr-xl right-0 left-0 border-b-2 bg-primary-bg text-white">
                    <div className="w-[64px] h-[6px] bg-gray-400 rounded-lg absolute top-[8px] left-[calc(50%-32px)]"></div>
                    <p style={{ height: `${drawerHeight}px` }} className="flex items-center p-4 text-white">
                        {clients.length} participants
                    </p>
                </div>
                <div className="h-full p-4 text-white bg-card-bg overflow-auto">
                    {clients.map((client, index) => (
                        <div key={index} className={`px-2 py-2 flex gap-2.5 items-center border-b-4 border-r-4 border-gray-700 rounded-lg mb-2 bg-primary-bg select-none`}>
                            <Tooltip title={`${client.username} ${socketID === client.socketID ? "(me)" : ""}`}>
                                <Avatar sx={avatarStyling(client)}>{client.username.charAt(0)}</Avatar>
                            </Tooltip>
                            <span className="overflow-hidden text-ellipsis">{client.username}</span>
                            {client.handRaised &&
                                <BackHand sx={{ position: "absolute", right: "32px", color: "#ffc016", transform: "scaleX(-1)" }} />
                            }
                        </div>
                    ))}
                </div>
            </SwipeableDrawer>
        </>
    );
};

export default Clients;