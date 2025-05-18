import type { User } from '@codesync/shared';

export type LogUserInArgs = {
    userID: string,
    username: string,
};

export type UserContextType = {
    user: User,
    isValidUser(user: User | undefined): boolean,
    handleUserChange(data: User): void,
    userFetchedFromLocalStorage: boolean,
    isLoggedIn: boolean,
    logUserIn(data: LogUserInArgs): void,
    logUserOut(): void,
};