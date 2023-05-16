// import { defineConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// import dotenv from 'dotenv';

// https://vitejs.dev/config/
// console.log("OLA ")
// dotenv.config({ path: '../.env' });

// export default defineConfig({
// 	server: {
// 		host: true,
// 		port: 8080,
// 	},
// 	plugins: [react()],
// 	resolve: {
// 		alias: [{ find: '@', replacement: '/src' }],
// 	},
// 	define: {
// 		'process.env': {
// 			REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
// 		},
// 	},
// });


export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
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
