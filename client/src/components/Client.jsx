import { BackHand } from "@mui/icons-material";
import { Avatar, Tooltip } from "@mui/material";

const Client = ({ me, username, userColor, handRaised, styling }) => {

    const avatarStyling = {
        width: "32px", height: "32px", bgcolor: userColor,
        border: me === username ? "3px solid #00a951" : "1px solid gray",
        boxShadow: me === username && "0 0 5px #00a951",
    };

    return (
        <div className={`px-2 flex gap-2 md:py-2 md:ml-2 md:mb-2 relative md:border-b-4 md:border-r-4 md:border-gray-700 rounded-lg items-center select-none ${styling}`}>
            <Tooltip title={`${username} ${me === username ? "(me)" : ""}`}>
                <Avatar sx={avatarStyling}>{username.charAt(0)}</Avatar>
            </Tooltip>
            <span className="hidden md:inline-block overflow-hidden text-ellipsis">{username}</span>
            {handRaised &&
                <BackHand sx={{ position: "absolute", right: "16px", color: "#ffc016", transform: "scaleX(-1)" }} />
            }
        </div>
    );
};

export default Client;