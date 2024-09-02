const CustomMenuItem = ({ title, id, value, valuesArray, handlevalueChange }) => {
    return (
        <div className="py-[4px] px-[16px] w-52 text-sm flex justify-between items-center select-none">
            <span className="cursor-default">{title}</span>
            <select
                id={id} defaultValue={value} onChange={handlevalueChange}
                className="block px-1 py-1.5 relative z-10 text-sm text-gray-300 bg-transparent cursor-pointer focus:outline-none focus:ring-0"
            >
                {valuesArray.map(({ value }) => (
                    <option key={value} value={value} className="text-black">{`${value}px`}</option>
                ))}
            </select>
        </div>
    );
};

export default CustomMenuItem;