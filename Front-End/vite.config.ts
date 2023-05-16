import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import envCompatible from 'vite-plugin-env-compatible';


https://vitejs.dev/config/
// console.log("OLA ")
dotenv.config({ path: '../.env' });
// dotenv.config()
// dotenv.config();
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	// const env = loadEnv(mode, process.cwd(), '');
	const env = loadEnv(mode, path.resolve(process.cwd(), '../'), '');

	return {
		server: {
			host: true,
			port: 8080,
		},
		plugins: [
			react(),
			// envCompatible({
			// 	dotenvDir: '../',
			//   }),
			],
		resolve: {
			alias: [{ find: '@', replacement: '/src' }],
		},
		define: {
			'process.env': process.env,
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


