import { defineConfig } from 'vite'
import { resolve } from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import legacy from '@vitejs/plugin-legacy'
import autoprefixer from 'autoprefixer'
import babel from 'vite-plugin-babel'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
	css: {
		postcss: {
			plugins: [autoprefixer({})],
		},
	},
	plugins: [
		handlebars({
			partialDirectory: resolve(__dirname, 'src/partials'),
		}),
		legacy({
			//   // targets: ["> 0.5%", "last 2 versions", "Firefox ESR", "not dead"],
			// targets: ["Chrome >= 49"],
		}),
		ViteImageOptimizer({
			jpeg: {
				// https://sharp.pixelplumbing.com/api-output#jpeg
				quality: 90,
			},
			jpg: {
				// https://sharp.pixelplumbing.com/api-output#jpeg
				quality: 90,
			},
			png: {
				quality: 90,
			},
		}),
	],

	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				index: resolve(__dirname, 'index.html'),
			},
		},
	},
	server: {
		port: 3000,
	},
})
