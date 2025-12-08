/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_DAPP_URL: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_MAIN_APP_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
