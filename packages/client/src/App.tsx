import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
// importing features
import { EditorProvider } from './features/editor';
import { useFetchUser } from './features/user';
// importing providers
import { PanelProvider } from './contexts/Panel.context';
import { SocketProvider } from './contexts/Socket.context';
// importing contexts
import { useModalContext } from './contexts/Modal.context';
import { useSnackBarContext } from './contexts/SnackBar.context';
// importing pages
import { Auth } from './pages/Auth.page';
import { Editor } from './pages/Editor.page';
import { Home } from './pages/Home.page';
import { Room } from './pages/Room.page';
import { Whiteboard } from './pages/Whiteboard.page';
// importing layout components
import { Footer } from './layouts/Footer';
import { NavBar } from './layouts/NavBar';
// importing components
import { LoadingModal } from './components/LoadingModal';
import { Modal } from './components/Modal';
import { SnackBar } from './components/SnackBar';

const App: React.FC = () => {
    const { modalState, modalData, closeModal } = useModalContext();
    const { snackBarState, snackBarData, closeSnackBar } = useSnackBarContext();

    const { loading } = useFetchUser();

    if (loading) {
        return <LoadingModal />;
    }

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/room' element={<Room />} />
                <Route
                    path='/editor/:roomID'
                    element={
                        <EditorProvider>
                            <SocketProvider>
                                <PanelProvider>
                                    <Editor />
                                </PanelProvider>
                            </SocketProvider>
                        </EditorProvider>
                    }
                />
                <Route path='/whiteboard/:roomID' element={<Whiteboard />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
            <Footer />
            <SnackBar
                openSnackBar={snackBarState}
                snackBarData={snackBarData}
                handleClose={closeSnackBar}
                timeOut={3000}
            />
            <Modal
                modalState={modalState}
                modalData={modalData}
                onClose={closeModal}
            />
        </BrowserRouter>
    );
};

export default App;