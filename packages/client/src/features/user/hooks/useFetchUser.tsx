import { useEffect, useState } from 'react';
// importing contexts
import { useUserContext } from '../contexts/User.context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../auth';

export const useFetchUser = () => {
    const [loading, setLoading] = useState(true);

    const { userFetchedFromLocalStorage, handleUserChange, logUserIn } = useUserContext();

    const fetchUserInfoFromLocalStorage = () => {
        const userString = localStorage.getItem('codesync-user-data');
        if (userString) {
            handleUserChange(JSON.parse(userString));
        }
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const { uid, displayName } = firebaseUser;

                const userString = localStorage.getItem('codesync-user-data');
                let username;
                if (userString) {
                    username = JSON.parse(userString)?.username;
                }

                logUserIn({
                    userID: uid,
                    username: username || displayName || 'Guest',
                });

                setLoading(false);
            } else if (!userFetchedFromLocalStorage) {
                fetchUserInfoFromLocalStorage();
            }
        });

        return () => unsubscribe();
    }, [userFetchedFromLocalStorage]);

    return { loading };
};