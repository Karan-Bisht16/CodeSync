const LogoInput = ({ type, placeholder, value, inputRef, handleChangeFunction, handleKeyUp, styling, autoFocus, autoComplete, logo }) => {
    return (
        <div className="flex items-center relative">
            <input
                type={type} placeholder={placeholder} value={value} ref={inputRef}
                onChange={handleChangeFunction} onKeyUp={handleKeyUp || null}
                className={`block sm:hidden w-full pr-12 text-md rounded-lg text-primary-accent-800 selection:bg-primary-accent-800 selection:text-white outline-1 outline-primary-accent-500 ${styling}`}
                autoFocus={false} autoComplete={autoComplete || "on"}
            />
            <input
                type={type} placeholder={placeholder} value={value} ref={inputRef}
                onChange={handleChangeFunction} onKeyUp={handleKeyUp || null}
                className={`hidden sm:block w-full pr-12 text-md rounded-lg text-primary-accent-800 selection:bg-primary-accent-800 selection:text-white outline-1 outline-primary-accent-500 ${styling}`}
                autoFocus={autoFocus} autoComplete={autoComplete || "on"}
            />
            <div className="absolute right-[10px] flex items-center bg-white">
                {logo}
            </div>
        </div>
    );
};

export { LogoInput };