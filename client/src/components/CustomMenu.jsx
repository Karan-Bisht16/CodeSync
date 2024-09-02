import { IconButton, Menu, Tooltip } from "@mui/material";

const CustomMenu = ({ tooltip, anchorEl, openMenu, handleOpenMenu, handleCloseMenu, anchorOrigin, transformOrigin, children, icon, styling }) => {
    return (
        <>
            <Tooltip title={tooltip}>
                <IconButton onClick={handleOpenMenu} className="cursor-pointer">
                    {icon}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}
                MenuListProps={{ "aria-labelledby": "menu-button" }} elevation={0}
                anchorOrigin={anchorOrigin || { vertical: "top", horizontal: "right" }}
                transformOrigin={transformOrigin || { vertical: "bottom", horizontal: "right" }}
                slotProps={{
                    paper: { sx: styling },
                }}
            >
                {children}
            </Menu>
        </>
    );
};

export default CustomMenu;