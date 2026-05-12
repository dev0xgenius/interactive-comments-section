import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: "./",
    outputDir: "../dist",
    publicDir: "public",

    server: {
        proxy: {
            "/auth": "http://localhost:8080",
            "/comments": {
                target: "ws://localhost:8080",
                ws: true,
                rewriteWsOrigin: true,
            },
        },
        hmr: {
            overlay: false,
            protocol: "ws",
        },
    },
});
