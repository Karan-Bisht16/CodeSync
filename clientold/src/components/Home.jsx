/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Logo from "./subcomponents/Logo";

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const roomIDField = useRef(null);
    const usernameField = useRef(null);

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        usernameField.current.focus();
        toast.success("Created a new room");
    };

    const joinRoom = () => {
        if (!username && !roomId) {
            toast.error("Room ID and username are required");
            roomIDField.current.focus();
            return;
        }
        if (!roomId.trim()) {
            toast.error("Room ID is required");
            roomIDField.current.focus();
            return;
        }
        if (!username.trim()) {
            toast.error("Username is required");
            usernameField.current.focus();
            return;
        }
        // Redirect on validation
        navigate(`/editor/${roomId}`, { state: { username } });
    };

    const handleInputEnter = (e) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center ">
            <div className="h-[85%] w-[90%] grid grid-cols-2 gap-16 mx-auto bg-red-800">
                <div className="flex flex-col justify-center bg-green-800" >
                    <div className="relative">
                        <img src="../assets/img-background.jpg" alt="background" className="w-[70%]" />
                        <div className="absolute bottom-0">
                            <p className="font-jost text-primary-accent">Hi there!</p>
                            <p className="text-[#A762FF]">Join and Code</p>
                        </div>
                    </div>
                </div>
                <div className="bg-violet-800">
                    <div>
                        <Logo />
                    </div>
                    <div>
                        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                        <div className="inputGroup">
                            <input
                                type="text"
                                className="inputBox"
                                placeholder="Room ID"
                                onChange={(e) => setRoomId(e.target.value)}
                                ref={roomIDField}
                                value={roomId}
                                onKeyUp={handleInputEnter}
                            />
                            <input
                                type="text"
                                className="inputBox"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                ref={usernameField}
                                value={username}
                                onKeyUp={handleInputEnter}
                            />
                            <button className="btn joinBtn" onClick={joinRoom}>
                                Join
                            </button>
                            <span className="createInfo">
                                If you don't have an invite then create &nbsp;
                                <a onClick={createNewRoom} href="" className="createNewBtn">
                                    new room
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;