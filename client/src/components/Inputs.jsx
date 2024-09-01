const LogoInput = ({ placeholder, value, inputRef, autoFocus, handleChangeFunction, handleKeyUp, logo }) => {
    return (
        <div className="flex items-center relative">
            <input
                type="text" placeholder={placeholder}
                value={value} ref={inputRef} autoFocus={autoFocus}
                onChange={handleChangeFunction} onKeyUp={handleKeyUp || null}
                className="w-full p-3 pr-12 text-md rounded-lg outline-none"
            />
            {logo}
        </div>
    );
};

export { LogoInput };