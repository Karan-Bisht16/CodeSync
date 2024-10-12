import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// importing pages
import Home from "./pages/Home.page";
import Room from "./pages/Room.page";
import EditorPage from "./pages/Editor.page";
import Whiteboard from "./pages/Whiteboard.page";
// importing contexts
import { ConfirmationDialogContext } from "./contexts/ConfirmationDialog.context";
// importing components
import ConfirmationDialog from "./components/ConfirmationDialog";

const App = () => {
    const { dialog, dialogValue, closeDialog, linearProgressBar, handleDialog } = useContext(ConfirmationDialogContext);

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        theme: { primary: "#4aed88" },
                    },
                }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/editor/:roomID" element={<EditorPage />} />
                    <Route path="/whiteboard/:roomID" element={<Whiteboard />} />
                </Routes>
            </BrowserRouter>
            <ConfirmationDialog
                dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog}
                linearProgressBar={linearProgressBar} dialogValue={dialogValue}
            />
        </>
    );
}

export default App;
