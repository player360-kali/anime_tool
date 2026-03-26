interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API: string;
  readonly VITE_ASSETS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
