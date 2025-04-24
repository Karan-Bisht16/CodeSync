import { useEffect, useState } from 'react';
// importing contexts
import { useUserContext } from '../contexts/User.context';

export const useFetchUser = () => {
    const [loading, setLoading] = useState(true);

    const { user, userFetchedFromLocalStorage, handleUserChange } = useUserContext();

    const fetchUserInfoFromLocalStorage = () => {
        const userString = localStorage.getItem('codesync-user-data');
        if (userString) {
            handleUserChange(JSON.parse(userString));
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!userFetchedFromLocalStorage) {
            fetchUserInfoFromLocalStorage();
        }
    }, [user, userFetchedFromLocalStorage]);

    return { loading };
};