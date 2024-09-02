import { Avatar, Tooltip } from "@mui/material";

const Client = ({ me, username, userColor, styling }) => {

    const avatarStyling = {
        width: "32px", height: "32px", bgcolor: userColor,
        border: me === username ? "3px solid #00a951" : "1px solid gray",
        boxShadow: me === username && "0 0 5px #00a951",
    };

    return (
        <div className={`px-2 py-1 flex gap-2 items-center select-none ${styling}`}>
            <Tooltip title={`${username} ${me === username ? "(me)" : ""}`}>
                <Avatar sx={avatarStyling}>{username.charAt(0)}</Avatar>
            </Tooltip>
            <span className="hidden md:inline-block overflow-hidden text-ellipsis">{username}</span>
        </div>
    );
};

export default Client;