/// <reference types='vite/client' />

interface ImportMeta {
    readonly env: ImportMetaEnv,
};

interface ImportMetaEnv {
    readonly MDOE: 'DEVELOPMENT' | 'PRODUCTION',
    readonly VITE_BACKEND_URL: string,
};