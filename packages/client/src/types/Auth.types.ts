export type AuthMode = 'login' | 'register' | false;

export type AuthContextType = {
    authModal: AuthMode,
    openAuthModal(data: AuthMode): void,
    closeAuthModal(): void,
};