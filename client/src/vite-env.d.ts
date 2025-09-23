interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEFAULT_REGION: string;
  // add more VITE_* as you create them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
