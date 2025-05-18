// importing provider and context
import { AuthProvider, useAuthContext } from './contexts/Auth.context';
// importing lib
import { analytics, auth } from './lib/firebase';
// importing components
import { AuthModal } from './components/AuthModal';

export {
    analytics,
    auth,
    AuthModal,
    AuthProvider,
    useAuthContext,
};