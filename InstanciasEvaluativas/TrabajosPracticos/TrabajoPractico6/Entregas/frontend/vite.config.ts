import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), ""); 

  const apiUrl = env.VITE_BACKEND_URL;
  console.log(`API URL: ${apiUrl}`);

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: apiUrl,           
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});
