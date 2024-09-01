const SidebarButton = ({ buttonFunction, title, logo, styling }) => {
    return (
        <button
            onClick={buttonFunction}
            className={`w-[95%] py-1.5 rounded-md flex gap-1 justify-center items-center outline-none ${styling}`}
        >
            {logo}
            {title}
        </button>
    );
};

export { SidebarButton };