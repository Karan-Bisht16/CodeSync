import React from "react";

const Logo = () => {
    return (
        <div className="relative w-16 flex justify-center">
            <lord-icon
                src="https://cdn.lordicon.com/xirobkro.json"
                trigger="in" delay="500" state="in-reveal"
                colors="primary:#0090c1,secondary:#0090c1"
                style={{ width: "50px", height: "50px" }}
            />
            <lord-icon
                src="https://cdn.lordicon.com/vlycxjwx.json"
                trigger="loop" delay="1500" state="in-reveal"
                colors="primary:#0090c1,secondary:#0090c1"
                style={{ width: "20px", height: "20px", position: "absolute", marginTop: "8px" }}
            />
        </div>
    );
};

export default Logo;