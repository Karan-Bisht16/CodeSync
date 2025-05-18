import React, { createContext, useContext, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateEmail,
    updatePassword,
    validatePassword
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
// importing types
import type { ContextChildrenProps } from '../../../types/Context.types';
import type {
    AuthContextType,
    AuthMode,
    GetAuthProviderReturnType,
    LoginArgs,
    RegisterArgs,
    UpdateUserEmailArgs,
    UpdateUserPasswordArgs
} from '../types';
// importing features
import { useUserContext } from '../../user';
// importing contexts
import { useSnackBarContext } from '../../../contexts/SnackBar.context';
// importing lib
import { auth } from '../lib/firebase';

const AuthContext = createContext<AuthContextType>({
    authModal: false,
    openAuthModal: (_data: AuthMode) => { },
    closeAuthModal: () => { },
    loginViaEmail: (_data: LoginArgs) => { },
    registerViaEmail: (_data: RegisterArgs) => { },
    signUpWithGoogle: () => { },
    signUpWithFacebook: () => { },
    signUpWithGitHub: () => { },
    logout: () => { },
    getAuthProvider: () => { return null; },
    updateUserEmail: async (_data: UpdateUserEmailArgs) => { return false; },
    updateUserPassword: async (_data: UpdateUserPasswordArgs) => { return false; },
    deleteAccount: async (_password: string) => { return false; },
});
export const useAuthContext = () => useContext(AuthContext);
export const AuthProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const { openSnackBar } = useSnackBarContext();
    const { logUserIn, logUserOut } = useUserContext();

    const [authModal, setAuthMode] = useState<AuthMode>(false);

    const openAuthModal = (mode: AuthMode) => {
        setAuthMode(mode);
    };

    const closeAuthModal = () => {
        setAuthMode(false);
    };

    const isPasswordValid = async (password: string) => {
        const status = await validatePassword(auth, password);
        const { isValid, meetsMaxPasswordLength, meetsMinPasswordLength, passwordPolicy } = status;
        const { customStrengthOptions } = passwordPolicy;
        const { maxPasswordLength, minPasswordLength } = customStrengthOptions;

        if (!isValid) {
            if (!meetsMaxPasswordLength) {
                openSnackBar({ status: 'error', message: `Password can be atmost ${maxPasswordLength} characters long` });
            }
            if (!meetsMinPasswordLength) {
                openSnackBar({ status: 'error', message: `Password must be atleast ${minPasswordLength} characters long` });
            }
        }
        return isValid;
    };

    const handleFirebaseError = (error: FirebaseError) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                openSnackBar({
                    status: 'error',
                    message: 'This email is already registered.'
                });
                break;
            case 'auth/invalid-email':
                openSnackBar({
                    status: 'error',
                    message: 'The email address is not valid.'
                });
                break;
            case 'auth/invalid-credential':
                openSnackBar({
                    status: 'error',
                    message: 'Either email or password is not valid.'
                });
                break;
            case 'auth/wrong-password':
                openSnackBar({
                    status: 'error',
                    message: 'Either email or password is not valid.'
                });
                break;
            case 'auth/operation-not-allowed':
                openSnackBar({
                    status: 'error',
                    message: 'Operation not allowed. Please contact support.'
                });
                break;
            case 'auth/too-many-requests':
                openSnackBar({
                    status: 'error',
                    message: 'Too many requests. Please try again later.'
                });
                break;
            case 'auth/popup-closed-by-user':
                openSnackBar({
                    status: 'error',
                    message: 'Sign in was cancelled. Please try again.'
                });
                break;
            case 'auth/cancelled-popup-request':
                openSnackBar({
                    status: 'error',
                    message: 'Another popup is already open.'
                });
                break;
            case 'auth/popup-blocked':
                openSnackBar({
                    status: 'error',
                    message: 'Popup was blocked by the browser. Please allow popups.'
                });
                break;
            case 'auth/account-exists-with-different-credential':
                openSnackBar({
                    status: 'error',
                    message: 'An account already exists with the same email but different sign-in method.',
                });
                break;
            default:
                openSnackBar({
                    status: 'error',
                    message: 'Something went wrong. Please try again.'
                });
        }
    };

    const handleError = (error: unknown) => {
        if (error instanceof FirebaseError) {
            handleFirebaseError(error);
        } else {
            openSnackBar({
                status: 'error',
                message: 'Something went wrong. Please try again.'
            });
        }
    };

    const registerViaEmail = async (data: RegisterArgs) => {
        if (!data) return;

        const { email, password, username } = data;
        if (!email || !password || !username) return;

        try {
            if (!await isPasswordValid(password)) return;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            // TODO: Store user data in firestore

            logUserIn({ userID: uid, username });
            closeAuthModal();
        } catch (error) {
            handleError(error);
        }
    };

    const loginViaEmail = async (data: LoginArgs) => {
        if (!data) return;

        const { email, password } = data;
        if (!email || !password) return;

        try {
            if (!await isPasswordValid(password)) return;


            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            const uid = userCredential.user.uid;

            logUserIn({ userID: uid, username: user.displayName || 'Guest' });
            closeAuthModal();
        } catch (error) {
            handleError(error);
        }
    };

    const signUpWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            // TODO: make use of user.photoUrl 

            logUserIn({ userID: user.uid, username: user.displayName || 'Guest' });
            closeAuthModal();
        } catch (error) {
            handleError(error);
        }
    };

    const signUpWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            logUserIn({ userID: user.uid, username: user.displayName || 'Guest' });
            closeAuthModal();
        } catch (error) {
            handleError(error);
        }
    };

    const signUpWithGitHub = async () => {
        const provider = new GithubAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            logUserIn({ userID: user.uid, username: user.displayName || 'Guest' });
            closeAuthModal();
        } catch (error) {
            handleError(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            logUserOut();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            openSnackBar({
                status: 'error',
                message: errorMessage
            });
        }
    };

    const getAuthProvider = (): GetAuthProviderReturnType => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return null;

        const providerData = currentUser.providerData
        if (providerData.length === 0) return null;

        const providerId = providerData[0].providerId;

        switch (providerId) {
            case 'google.com':
                return 'google';
            case 'facebook.com':
                return 'facebook';
            case 'github.com':
                return 'gitHub';
            case 'password':
                return 'email';
            default:
                return null;
        }
    };

    const reauthenticate = async (password?: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return;

        const provider = getAuthProvider();

        if (provider === 'email') {
            if (!password) return;
            const credential = EmailAuthProvider.credential(currentUser.email, password);
            await reauthenticateWithCredential(currentUser, credential);
        } else if (provider === 'google') {
            const googleProvider = new GoogleAuthProvider();
            await reauthenticateWithPopup(currentUser, googleProvider);
        } else if (provider === 'facebook') {
            const facebookProvider = new FacebookAuthProvider();
            await reauthenticateWithPopup(currentUser, facebookProvider);
        } else if (provider === 'gitHub') {
            const githubProvider = new GithubAuthProvider();
            await reauthenticateWithPopup(currentUser, githubProvider);
        } else {
            throw new Error('Unsupported auth provider for reauthentication');
        }
    };

    const updateUserEmail = async (data: UpdateUserEmailArgs) => {
        if (!data) return false;

        const { password, newEmail } = data;
        if (!password || !newEmail) return false;

        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return false;

        const provider = getAuthProvider();
        if (provider !== 'email') {
            openSnackBar({
                status: 'error',
                message: 'Cannot update email for social login users.',
            });
            return false;
        }

        try {
            if (!await isPasswordValid(password)) return false;

            await reauthenticate(password);
            await updateEmail(currentUser, newEmail);
            await sendEmailVerification(currentUser);

            openSnackBar({
                status: 'success',
                message: 'Email updated successfully',
            });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    const updateUserPassword = async (data: UpdateUserPasswordArgs) => {
        if (!data) return false;

        const { password, newPassword } = data;
        if (!password || !newPassword) return false;

        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return false;

        try {
            await reauthenticate(password);
            if (!await isPasswordValid(newPassword)) return false;

            await updatePassword(currentUser, newPassword)

            openSnackBar({
                status: 'success',
                message: 'Password updated successfully',
            });
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    const deleteAccount = async (password: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) return false;

        try {
            await reauthenticate(password);
            await deleteUser(currentUser);

            openSnackBar({
                status: 'success',
                message: 'Account deleted successfully',
            });
            logout();
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authModal,
                openAuthModal,
                closeAuthModal,
                loginViaEmail,
                registerViaEmail,
                signUpWithGoogle,
                signUpWithFacebook,
                signUpWithGitHub,
                logout,
                getAuthProvider,
                updateUserEmail,
                updateUserPassword,
                deleteAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};