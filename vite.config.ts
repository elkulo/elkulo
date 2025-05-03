import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// https://vite.dev/config/
export default defineConfig(() => {
	const __dirname = dirname(fileURLToPath(import.meta.url)); // プロジェクトルートのパス.

	return {
		base: './', // index.html に相対パスで出力.
		root: 'static', // static/index.html
		envDir: '../', // rootから見て環境変数の場所.
		publicDir: './', // rootと同じディレクトリへ public -> static
		build: {
			emptyOutDir: false, // rootの外を参照.
			outDir: '../public', // rootから見て出力先 dist -> public
			minify: 'terser',
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					// ビルドファイル.
					entryFileNames: '_output/js/[name].min.js',
					chunkFileNames: '_output/js/chunks/[name].[hash].js',
					assetFileNames: (assetInfo) => {
						if (assetInfo.names.some((x) => /\.(gif|png|jpe?g|webp|svg)$/i.test(x))) {
							return '_output/images/[name].[hash].[ext]';
						}
						if (assetInfo.names.some((x) => /\.(eot|wof|woff|woff2|ttf)$/i.test(x))) {
							return '_output/fonts/[name].[hash].[ext]';
						}
						if (assetInfo.names.some((x) => /\.(css)$/i.test(x))) {
							return '_output/css/[name].min.[ext]';
						}
						return '_output/[ext]/[name].[ext]';
					},
					manualChunks: {
						// 分割ファイル.
						md5: ['md5'],
						axios: ['axios'],
						react: ['react', 'react-dom', 'react-markdown', 'remark-gfm'],
					},
				},
			},
		},
		plugins: [
			react(),
			{
				name: 'markdown-loader',
				transform(code, id) {
					if (id.slice(-3) === '.md') {
						// For .md files, get the raw content
						return `export default ${JSON.stringify(code)};`;
					}
				},
			},
			legacy({
				targets: ['defaults', 'not IE 11'],
				modernPolyfills: true,
				renderLegacyChunks: false,
			}),
		],
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
				},
			},
			modules: {
				localsConvention: 'dashes', // CSS Modulesでハイフン付きクラスをキャメルケース呼び出し.
			},
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
			},
		},
	};
});
