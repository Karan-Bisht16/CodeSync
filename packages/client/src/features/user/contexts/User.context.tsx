import React, { createContext, useContext, useState } from 'react';
// importing types
import type { User } from '@codesync/shared';
import type { ContextChildrenProps } from '../../../types/Context.types';
import type { UserContextType } from '../types';

const UserContext = createContext<UserContextType>({
    user: {} as User,
    isValidUser: (_user: User): boolean => { return false; },
    handleUserChange: (_data: User): void => { },
    userFetchedFromLocalStorage: false,
    isLoggedIn: false,
});
export const useUserContext = () => useContext(UserContext);
export const UserProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const [userFetchedFromLocalStorage, setUserFetchedFromLocalStorage] = useState<boolean>(false);
    const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User>({
        userID: '',
        username: '',
        userColor: '',
        handRaised: false,
        roles: [],
        createdAt: Date.now(),
    });

    const isValidUser = (user: User | undefined): boolean => {
        if (!user) return false;

        const { userID, username, userColor, handRaised, createdAt, roles } = user;

        const isValidString = (value: unknown): boolean =>
            typeof value === 'string' && value.trim().length > 0;

        const validRoles = ['user', 'moderator', 'host'];
        const areRolesValid = roles === undefined || Array.isArray(roles)
            && roles.every(role => validRoles.includes(role));

        if (!isValidString(userID)) {
            console.warn('userID is not a valid string');
            console.warn('userID: ', userID);
            return false;
        }
        if (!isValidString(username)) {
            console.warn('username is not a valid string');
            console.warn('username: ', username);
            return false;
        }
        if (!isValidString(userColor)) {
            console.warn('userColor is not a valid string');
            console.warn('userColor: ', userColor);
            return false;
        }
        if (typeof createdAt !== 'number') {
            console.warn('createdAt is not a number');
            console.warn('createdAt: ', createdAt);
            return false;
        }
        if (typeof handRaised !== 'boolean') {
            console.warn('handRaised is not a boolean');
            console.warn('handRaised: ', handRaised);
            return false;
        }
        if (!areRolesValid) {
            console.warn('roles is not valid');
            console.warn('roles: ', roles);
            return false;
        }

        return true;
    };

    const handleUserChange = (data: User) => {
        if (!isValidUser(data)) return;

        setUser(data);

        // don't store socketID, roles, blockedBy, admittedRooms in localStorage
        const localUserData = {
            userID: data.userID,
            username: data.username,
            handRaised: data.handRaised,
            userColor: data.userColor,
            createdAt: data.createdAt,
        };

        localStorage.setItem('codesync-user-data', JSON.stringify(localUserData));
        setUserFetchedFromLocalStorage(true);
    };

    return (
        <UserContext.Provider value={{
            user,
            isValidUser,
            handleUserChange,
            userFetchedFromLocalStorage,
            isLoggedIn,
        }}>
            {children}
        </UserContext.Provider>
    );
};