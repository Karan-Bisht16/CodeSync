const Logo = ({ color }) => {
    return (
        <div className="relative w-16 flex justify-center">
            <lord-icon
                src="https://cdn.lordicon.com/xirobkro.json"
                trigger="in" state="in-reveal"
                colors={`primary:${color},secondary:${color}`}
                style={{ width: "50px", height: "50px" }}
            />
            <lord-icon
                src="https://cdn.lordicon.com/vlycxjwx.json"
                trigger="loop" delay="1500" state="in-reveal"
                colors={`primary:${color},secondary:${color}`}
                style={{ width: "20px", height: "20px", position: "absolute", marginTop: "8px" }}
            />
        </div>
    );
};

export default Logo;