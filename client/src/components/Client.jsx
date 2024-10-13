import { BackHand } from "@mui/icons-material";
import { Avatar, Tooltip } from "@mui/material";

const Client = ({ socketID, client, styling }) => {

    const avatarStyling = {
        width: "32px", height: "32px", bgcolor: client.userColor,
        border: socketID === client.socketID ? "3px solid #00a951" : "1px solid gray",
        boxShadow: socketID === client.socketID && "0 0 5px #00a951",
    };

    return (
        <div className={`px-2 flex gap-2 md:py-2 md:ml-2 md:mb-2 relative md:border-b-4 md:border-r-4 md:border-gray-700 rounded-lg items-center select-none ${styling}`}>
            <Tooltip title={`${client.username} ${socketID === client.socketID ? "(me)" : ""}`}>
                <Avatar sx={avatarStyling}>{client.username.charAt(0)}</Avatar>
            </Tooltip>
            <span className="hidden md:inline-block overflow-hidden text-ellipsis">{client.username}</span>
            {client.handRaised &&
                <BackHand
                    className=" text-[#ffc016] transform scale-[0.5] -scale-x-50 md:scale-100 absolute right-6 md:right-4 -top-[10px] md:top-[10px]"
                />
            }
        </div>
    );
};

export default Client;