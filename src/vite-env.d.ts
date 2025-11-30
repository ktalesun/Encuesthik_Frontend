/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  // Añade más variables de entorno aquí según necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
