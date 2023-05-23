import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const envDir = path.resolve(__dirname, "../");
	const env = Object.assign(process.env, loadEnv(mode, envDir, ""));

	return {
		server: {
			host: true,
			port: 8080,
		},
		plugins: [react()],
		resolve: {
			alias: [{ find: '@', replacement: '/src' }],
		},
		define: {
			VITE_BACKEND_URL: env.VITE_BACKEND_URL,
	 	 },
	}
  })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
// 	server: {
// 		host: true,
// 		port: 8080,
// 	},
// 	plugins: [react()],
// 	resolve: {
// 		alias: [{ find: '@', replacement: '/src' }],
// 	},
// });


