import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1];

  // Default to the GitHub Pages project-site path when running in Actions,
  // so missing BASE_PATH doesn't produce a blank page due to 404'd assets.
  const inferredBasePath =
    repoOwner &&
    repoName &&
    repoName.toLowerCase() === `${repoOwner}.github.io`.toLowerCase()
      ? "/"
      : repoName
        ? `/${repoName}/`
        : "./";

  return {
    base: mode === "production" ? (process.env.BASE_PATH ?? inferredBasePath) : "/",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
