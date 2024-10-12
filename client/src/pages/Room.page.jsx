import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
// importing components
import { LogoWithTitle } from "../components/Logo";
import { LogoInput } from "../components/Inputs";
// importing utils
import { checkServerAvailibility } from "../utils/api";
// importing theme
import { colors, userThemes } from "../constants/Themes";
// importing assets
import imgBackground from "../assets/img-background-2.jpg";

const Room = () => {
    const navigate = useNavigate();

    const [roomID, setRoomID] = useState("");
    const [username, setUsername] = useState("");
    const roomIDField = useRef(null);
    const usernameField = useRef(null);

    const [loading, setLoading] = useState(false);

    const createNewRoom = (event) => {
        event.preventDefault();
        const ID = uuidV4();
        setRoomID(ID);
        usernameField.current.focus();
        toast.success("Created a new room");
    };

    const joinRoom = async () => {
        if (!username && !roomID) {
            toast.error("Room ID and username are required");
            roomIDField.current.focus();
            return;
        }
        if (!roomID.trim()) {
            toast.error("Room ID is required");
            roomIDField.current.focus();
            return;
        }
        if (!username.trim()) {
            toast.error("Username is required");
            usernameField.current.focus();
            return;
        }
        if (roomID.includes("/") || roomID.trim().includes(" ")) {
            toast.error("Invalid room");
            roomIDField.current.focus();
            return;
        }
        const userColor = userThemes[Math.floor(Math.random() * userThemes.length)];
        // set loading screen until server wakes up 
        setLoading(true);
        const response = await checkServerAvailibility();
        if (response) {
            navigate(`/editor/${roomID}`, { state: { username, userColor } });
        } else {
            toast.error("Server is down. Try again in a few moments");
        }
        setLoading(false);
    };

    const handleInputEnter = (key) => {
        if (key.keyCode === 13) {
            joinRoom();
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center select-none">
            {/* shadow-[2px_30px_75px_0_rgba(60,86,101,1)] */}
            <div className="h-[85%] w-[95%] md:w-[90%] max-h-[600px] max-w-[1080px] flex md:grid md:grid-cols-2 items-center md:items-stretch gap-8 mx-auto bg-primary-bg rounded-lg shadow-[0_0_25px_0_rgba(60,86,101,1)] md:shadow-[2px_4px_25px_0_rgba(60,86,101,1)]">
                <div className="hidden md:flex justify-center items-center" >
                    <div className="relative">
                        <div className="flex justify-center">
                            <img src={imgBackground} alt="background" className="w-[90%]" />
                            <div className="w-[90%] ml-3 font-extrabold uppercase text-xl sm:text-2xl md:text-4xl text-primary-accent-600 absolute bottom-0">
                                <p className="">Hi there!</p>
                                <p className="">Join and Code</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-auto mx-4 md:mx-8 my-12 px-4 py-8 md:px-8 rounded-lg bg-secondary-bg">
                    <LogoWithTitle color={`${colors["primary-accent"]["500"]}`} />
                    <div className="flex flex-col gap-3 mt-8">
                        <LogoInput
                            type="text" placeholder="Enter room ID" value={roomID} inputRef={roomIDField}
                            handleChangeFunction={(event) => setRoomID(event.target.value)} handleKeyUp={handleInputEnter}
                            styling="p-3" autoFocus={true} autoComplete="off"
                            logo={
                                <lord-icon
                                    src="https://cdn.lordicon.com/rfgxevig.json" trigger="loop-on-hover" stroke="bold"
                                    colors={`primary:${colors["primary-accent"]["500"]},secondary:${colors["primary-accent"]["500"]}`}
                                    style={{ width: "30px", height: "46px" }}
                                />
                            }
                        />
                        <LogoInput
                            type="text" placeholder="Enter a username" value={username} inputRef={usernameField}
                            handleChangeFunction={(event) => setUsername(event.target.value)} handleKeyUp={handleInputEnter}
                            styling="p-3"
                            logo={
                                <lord-icon
                                    src="https://cdn.lordicon.com/bgebyztw.json" trigger="loop-on-hover" stroke="bold" state="hover-looking-around"
                                    colors={`primary:${colors["primary-accent"]["500"]},secondary:${colors["primary-accent"]["500"]}`}
                                    style={{ width: "30px", height: "46px" }}
                                />
                            }
                        />
                        <button
                            onClick={joinRoom}
                            className="w-full p-2 font-bold font-blinker text-2xl text-white uppercase rounded-lg bg-primary-accent-700 hover:bg-primary-accent-800"
                        >
                            Join
                        </button>
                        <div className="w-full text-white text-center relative my-2">
                            <span className="bg-secondary-bg px-2.5 relative z-10">or</span>
                            <hr className="absolute w-full top-[50%] z-0" />
                        </div>
                        <p className="text-center text-white">
                            Don't have an invite?&nbsp;
                            <br className="inline-block md:hidden" />Create a&nbsp;
                            <a onClick={createNewRoom} href="" className="text-primary-accent-500 hover:text-primary-accent-600">
                                new room
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            {loading &&
                <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center z-10">
                    <div className="h-screen w-screen fixed top-0 left-0 opacity-25 bg-black">
                    </div>
                    <div className="h-1/3 md:h-1/2 w-[85%] md:w-1/2 flex flex-col justify-center items-center rounded-md bg-tertiary-bg">
                        <lord-icon
                            src="https://cdn.lordicon.com/zvheymqn.json" trigger="loop"
                            colors={`primary:${colors["primary-accent"]["400"]},secondary:white`}
                            style={{ width: "250px", height: "250px" }}
                        />
                        <div className="text-white relative -top-5 text-center">
                            <p className="font-blinker text-3xl">Getting you ready!</p>
                            <span className="text-sm">
                                This dealy is due to render server inactivity.&nbsp;
                                <br className="inline-block md:hidden" />
                                Please be patient.
                            </span>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Room;