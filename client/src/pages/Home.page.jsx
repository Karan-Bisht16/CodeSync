import { Link } from "react-router-dom";
// importing components
import { LogoWithTitle } from "../components/Logo";
// importing themes
import { colors } from "../constants/Themes";

const Home = () => {
    return (
        <div className="text-white">
            <LogoWithTitle color={`${colors["primary-accent"]["500"]}`} />
            <Link to='/room'>Get Started</Link>
        </div>
    );
};

export default Home;