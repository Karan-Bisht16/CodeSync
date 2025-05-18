/// <reference types='vite/client' />

interface ImportMeta {
    readonly env: ImportMetaEnv,
};

interface ImportMetaEnv {
    readonly VITE_MODE: 'DEVELOPMENT' | 'PRODUCTION',
    readonly VITE_BACKEND_URL: string,
    readonly VITE_FIREBASE_API_KEY: string,
    readonly VITE_FIREBASE_AUTH_DOMAIN: string,
    readonly VITE_FIREBASE_PROJECT_ID: string,
    readonly VITE_FIREBASE_STORAGE_BUCKET: string,
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string,
    readonly VITE_FIREBASE_APP_ID: string,
    readonly VITE_FIREBASE_MEASUREMENT_ID: string,
};