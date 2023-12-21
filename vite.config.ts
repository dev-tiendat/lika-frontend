import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), "src/assets/icons")],
			symbolId: "icon-[dir]-[name]"
		})
	],
	resolve: {
		alias: [{ find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) }]
	},
	// server: {
	// 	port: 3000
	// }
});
