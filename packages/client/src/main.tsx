import { createRoot } from 'react-dom/client';
// importing features
import { RoomProvider } from './features/room';
import { SettingsProvider } from './features/settings';
import { UserProvider } from './features/user';
// importing providers
import { AuthProvider } from './contexts/Auth.context';
import { ColorProvider } from './contexts/Color.context';
import { MobileProvider } from './contexts/Mobile.context';
import { ModalProvider } from './contexts/Modal.context';
import { SnackBarProvider } from './contexts/SnackBar.context';
// importing components
import App from './App';
// importing styling
import './index.css';

createRoot(document.getElementById('root')!).render(
    <SettingsProvider>
        <ColorProvider>
            <MobileProvider>
                <ModalProvider>
                    <SnackBarProvider>
                        <AuthProvider>
                            <UserProvider>
                                <RoomProvider>
                                    <App />
                                </RoomProvider>
                            </UserProvider>
                        </AuthProvider>
                    </SnackBarProvider>
                </ModalProvider>
            </MobileProvider>
        </ColorProvider>
    </SettingsProvider>
);