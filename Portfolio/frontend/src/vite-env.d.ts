// AI-AGENT CONTEXT: FILE=vite-env | ROLE=Environment_Types | PURPOSE=Vite_Env_Variable_Typings
/// <reference types="vite/client" />

// AI-LOGICAL-REGION: ImportMetaEnv_Definition
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

// AI-LOGICAL-REGION: ImportMeta_Extension
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// AI-NAVIGATION: EXPORT=ImportMetaEnv,ImportMeta
