import type { User } from '@codesync/shared';

export type UserContextType = {
    user: User,
    isValidUser(user: User | undefined): boolean,
    handleUserChange(data: User): void,
    userFetchedFromLocalStorage: boolean,
    isLoggedIn: boolean,
};