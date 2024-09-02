import { useNavigate } from "react-router-dom";
// importing components
import { LogoWithTitle } from "../components/Logo";
// importing themes
import { colors } from "../constants/Themes";
// importing assets
import imgBackground from "../assets/img-background-1.png";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen flex justify-center items-center select-none text-white">
            <div className="w-[95%] md:w-[90%] p-4 md:p-8 flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-8 bg-card-bg">
                <div className="col-span-3">
                    {/* <LogoWithTitle color={`${colors["primary-accent"]["500"]}`} styling="!justify-start" /> */}
                    <LogoWithTitle color="white" styling="!justify-start" />
                    <div className="ml-2 mb-8 md:mb-12">
                        <p className="font-blackOpsOne pt-2.5 md:pt-5 text-2xl md:text-4xl lg:text-5xl 2xl:text-[71px]">A Real-Time Code Collaboration Tool</p>
                        <p className="text-sm md:text-lg">
                            For seamless code collaboration in virtual rooms, create or join rooms and collaborate
                            in real time, with code highlighting and customizable editors enhancing your experience.
                        </p>
                    </div>
                    {/* linear-gradient(90deg, #5BB2C5 1%, #408290 34%, #346B77 52.5%, #2A5760 70%, #173035 92%) */}
                    <button onClick={() => navigate("/room")} className="h-16 w-60 ml-2 text-2xl font-blinker rounded-md border-2 border-[#346B77] before:ease relative overflow-hidden bg-[#346B77] text-white shadow-xl transition-all before:absolute before:right-0 before:top-0 before:h-16 before:w-6 before:translate-x-16 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:before:-translate-x-60">
                        <span relative="relative z-10">Get Started</span>
                    </button>
                </div>
                <div className="col-span-2 flex justify-center">
                    <img src={imgBackground} alt="background" className="w-full max-h-[325px] md:max-h-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export default Home;