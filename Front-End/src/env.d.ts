/// <reference types="vite/client" />

interface ImportMetaEnv {
		readonly VITE_BACKEND_URL?: string;
		// Ajoutez d'autres variables d'environnement si nécessaire
  }

interface ImportMeta {
	readonly env: ImportMetaEnv
}
