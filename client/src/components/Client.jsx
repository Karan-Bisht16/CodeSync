import { Avatar, Tooltip } from "@mui/material";

const Client = ({ me, username, userColor }) => {

    const avatarStyling = {
        width: "32px", height: "32px", bgcolor: userColor,
        border: me === username && "3px solid #00a951",
        boxShadow: me === username && "0 0 5px #00a951",
    };

    return (
        <div className="px-2 py-1 flex gap-2 items-center select-none">
            <Tooltip title={`${username} ${me === username ? "(me)" : ""}`}>
                <Avatar sx={avatarStyling}>{username.charAt(0)}</Avatar>
            </Tooltip>
            <span className="overflow-hidden text-ellipsis">{username}</span>
        </div>
    );
};

export default Client;