export type AuthMode = 'login' | 'register' | false;

export type LoginArgs = {
    email: string,
    password: string,
};

export type RegisterArgs = LoginArgs & {
    username: string
};

export type UpdateUserEmailArgs = {
    password: string,
    newEmail: string,
};

export type UpdateUserPasswordArgs = {
    password: string,
    newPassword: string,
};

export type GetAuthProviderReturnType = 'google' | 'facebook' | 'gitHub' | 'email' | null;

export type AuthContextType = {
    authModal: AuthMode,
    openAuthModal(data: AuthMode): void,
    closeAuthModal(): void,
    loginViaEmail(data: LoginArgs): void,
    registerViaEmail(data: RegisterArgs): void,
    signUpWithGoogle(): void,
    signUpWithFacebook(): void,
    signUpWithGitHub(): void,
    logout(): void,
    getAuthProvider(): GetAuthProviderReturnType,
    updateUserEmail(data: UpdateUserEmailArgs): Promise<boolean>,
    updateUserPassword(data: UpdateUserPasswordArgs): Promise<boolean>,
    deleteAccount(password: string): Promise<boolean>,
};