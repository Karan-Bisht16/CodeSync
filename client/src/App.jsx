import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import EditorPage from "./components/EditorPage";
import { Toaster } from "react-hot-toast";
import Whiteboard from "./components/Whiteboard";

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: "#4aed88",
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/editor/:roomId" element={<EditorPage />}></Route>
                    <Route path="/whiteboard/:roomId" element={<Whiteboard />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
