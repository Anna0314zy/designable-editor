// vite.config.ts
import { defineConfig } from "file:///Users/aimwhy/Desktop/slides-engine/node_modules/.pnpm/vite@5.0.0_@types+node@20.5.9_less@4.2.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/aimwhy/Desktop/slides-engine/node_modules/.pnpm/@vitejs+plugin-react@4.2.0_vite@5.0.0/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import basicSsl from "file:///Users/aimwhy/Desktop/slides-engine/node_modules/.pnpm/@vitejs+plugin-basic-ssl@1.0.1_vite@5.0.0/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";

// package.json
var package_default = {
  name: "task",
  private: true,
  version: "0.0.8",
  type: "module",
  scripts: {
    dev: "vite --mode dev",
    "build:test": "pnpm install && node ./scripts/setVersion.cjs && vite build --mode test",
    "build:prod": "pnpm install && vite build --mode prod",
    "hotUpdate:test": "node ./scripts/release.cjs --mode test",
    "release:test": "npm run build:test && npm run hotUpdate:test"
  },
  dependencies: {
    "@editor/core": "workspace:^",
    "@editor/react": "workspace:^",
    "@editor/typing": "workspace:^",
    "@ld/slide-editor": "workspace:^",
    "@slide/fonts": "workspace:^1.0.0",
    "@play/render": "workspace:^",
    "@rematch/core": "^2.2.0",
    "@rematch/immer": "^2.1.3",
    "@slides/animate": "workspace:^",
    "@vitejs/plugin-basic-ssl": "^1.0.1",
    ahooks: "^3.7.10",
    antd: "^5.12.8",
    "array-move": "^4.0.0",
    classnames: "^2.3.2",
    i18next: "^23.7.9",
    immer: "^9.0.6",
    "lodash-es": "^4.17.21",
    moment: "^2.30.1",
    "post-me": "^0.4.5",
    "react-i18next": "^13.5.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.1.1",
    "react-sortable-hoc": "^2.0.0",
    uuid: "^9.0.1"
  },
  devDependencies: {
    "@types/lodash-es": "^4.17.12",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/uuid": "^9.0.7",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.2.0",
    "cos-nodejs-sdk-v5": "^2.12.6",
    eslint: "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    inquirer: "^9.2.15",
    minimist: "^1.2.8",
    typescript: "^5.2.2",
    vite: "^5.0.0"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "/Users/aimwhy/Desktop/slides-engine/task";
var vite_config_default = defineConfig({
  base: "./",
  build: {
    outDir: "dist/" + package_default.version
  },
  plugins: [react(), basicSsl()],
  envDir: "env",
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    strictPort: true,
    port: 5176,
    proxy: {
      "/api": {
        target: "",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
      "/test": {
        target: "",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/test/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FpbXdoeS9EZXNrdG9wL3NsaWRlcy1lbmdpbmUvdGFza1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FpbXdoeS9EZXNrdG9wL3NsaWRlcy1lbmdpbmUvdGFzay92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWltd2h5L0Rlc2t0b3Avc2xpZGVzLWVuZ2luZS90YXNrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgYmFzaWNTc2wgZnJvbSAnQHZpdGVqcy9wbHVnaW4tYmFzaWMtc3NsJ1xuaW1wb3J0IHBhY2thZ2VKc29uIGZyb20gJy4vcGFja2FnZS5qc29uJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcuLycsXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdC8nICsgcGFja2FnZUpzb24udmVyc2lvbixcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksYmFzaWNTc2woKV0sXG4gIGVudkRpcjpcImVudlwiLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIilcbiAgICB9XG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgcG9ydDogNTE3NixcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vdGVzdC1jbGFzcy1hcGktb25saW5lLnNhYXNwLnZkeW9vLmNvbVwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcbiAgICAgIH0sXG4gICAgICBcIi90ZXN0XCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9tYXN0ZXItY291cnNlLWJldGEtaW5uZXIuc2Fhc3AudmR5b28uY29tXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Rlc3QvLCBcIlwiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJ0YXNrXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInZlcnNpb25cIjogXCIwLjAuOFwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcInZpdGUgLS1tb2RlIGRldlwiLFxuICAgIFwiYnVpbGQ6dGVzdFwiOiBcInBucG0gaW5zdGFsbCAmJiBub2RlIC4vc2NyaXB0cy9zZXRWZXJzaW9uLmNqcyAmJiB2aXRlIGJ1aWxkIC0tbW9kZSB0ZXN0XCIsXG4gICAgXCJidWlsZDpwcm9kXCI6IFwicG5wbSBpbnN0YWxsICYmIHZpdGUgYnVpbGQgLS1tb2RlIHByb2RcIixcbiAgICBcImhvdFVwZGF0ZTp0ZXN0XCI6IFwibm9kZSAuL3NjcmlwdHMvcmVsZWFzZS5janMgLS1tb2RlIHRlc3RcIixcbiAgICBcInJlbGVhc2U6dGVzdFwiOiBcIm5wbSBydW4gYnVpbGQ6dGVzdCAmJiBucG0gcnVuIGhvdFVwZGF0ZTp0ZXN0XCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGVkaXRvci9jb3JlXCI6IFwid29ya3NwYWNlOl5cIixcbiAgICBcIkBlZGl0b3IvcmVhY3RcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQGVkaXRvci90eXBpbmdcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQGxkL3NsaWRlLWVkaXRvclwiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAc2xpZGUvZm9udHNcIjogXCJ3b3Jrc3BhY2U6XjEuMC4wXCIsXG4gICAgXCJAcGxheS9yZW5kZXJcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQHJlbWF0Y2gvY29yZVwiOiBcIl4yLjIuMFwiLFxuICAgIFwiQHJlbWF0Y2gvaW1tZXJcIjogXCJeMi4xLjNcIixcbiAgICBcIkBzbGlkZXMvYW5pbWF0ZVwiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1iYXNpYy1zc2xcIjogXCJeMS4wLjFcIixcbiAgICBcImFob29rc1wiOiBcIl4zLjcuMTBcIixcbiAgICBcImFudGRcIjogXCJeNS4xMi44XCIsXG4gICAgXCJhcnJheS1tb3ZlXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJjbGFzc25hbWVzXCI6IFwiXjIuMy4yXCIsXG4gICAgXCJpMThuZXh0XCI6IFwiXjIzLjcuOVwiLFxuICAgIFwiaW1tZXJcIjogXCJeOS4wLjZcIixcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJtb21lbnRcIjogXCJeMi4zMC4xXCIsXG4gICAgXCJwb3N0LW1lXCI6IFwiXjAuNC41XCIsXG4gICAgXCJyZWFjdC1pMThuZXh0XCI6IFwiXjEzLjUuMFwiLFxuICAgIFwicmVhY3QtcmVkdXhcIjogXCJeOS4wLjRcIixcbiAgICBcInJlYWN0LXJvdXRlci1kb21cIjogXCJeNi4xLjFcIixcbiAgICBcInJlYWN0LXNvcnRhYmxlLWhvY1wiOiBcIl4yLjAuMFwiLFxuICAgIFwidXVpZFwiOiBcIl45LjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0eXBlcy9sb2Rhc2gtZXNcIjogXCJeNC4xNy4xMlwiLFxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjIuMTVcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMi43XCIsXG4gICAgXCJAdHlwZXMvdXVpZFwiOiBcIl45LjAuN1wiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNi4xMC4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjYuMTAuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4yLjBcIixcbiAgICBcImNvcy1ub2RlanMtc2RrLXY1XCI6IFwiXjIuMTIuNlwiLFxuICAgIFwiZXNsaW50XCI6IFwiXjguNTMuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1ob29rc1wiOiBcIl40LjYuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1yZWZyZXNoXCI6IFwiXjAuNC40XCIsXG4gICAgXCJpbnF1aXJlclwiOiBcIl45LjIuMTVcIixcbiAgICBcIm1pbmltaXN0XCI6IFwiXjEuMi44XCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMi4yXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMC4wXCJcbiAgfVxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxvQkFBb0I7QUFDdlUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGNBQWM7OztBQ0hyQjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsY0FBYztBQUFBLElBQ2Qsa0JBQWtCO0FBQUEsSUFDbEIsZ0JBQWdCO0FBQUEsRUFDbEI7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxnQkFBZ0I7QUFBQSxJQUNoQixpQkFBaUI7QUFBQSxJQUNqQixrQkFBa0I7QUFBQSxJQUNsQixvQkFBb0I7QUFBQSxJQUNwQixnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxJQUNoQixpQkFBaUI7QUFBQSxJQUNqQixrQkFBa0I7QUFBQSxJQUNsQixtQkFBbUI7QUFBQSxJQUNuQiw0QkFBNEI7QUFBQSxJQUM1QixRQUFVO0FBQUEsSUFDVixNQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsSUFDZCxZQUFjO0FBQUEsSUFDZCxTQUFXO0FBQUEsSUFDWCxPQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixRQUFVO0FBQUEsSUFDVixXQUFXO0FBQUEsSUFDWCxpQkFBaUI7QUFBQSxJQUNqQixlQUFlO0FBQUEsSUFDZixvQkFBb0I7QUFBQSxJQUNwQixzQkFBc0I7QUFBQSxJQUN0QixNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIsb0JBQW9CO0FBQUEsSUFDcEIsZ0JBQWdCO0FBQUEsSUFDaEIsb0JBQW9CO0FBQUEsSUFDcEIsZUFBZTtBQUFBLElBQ2Ysb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0Isd0JBQXdCO0FBQUEsSUFDeEIscUJBQXFCO0FBQUEsSUFDckIsUUFBVTtBQUFBLElBQ1YsNkJBQTZCO0FBQUEsSUFDN0IsK0JBQStCO0FBQUEsSUFDL0IsVUFBWTtBQUFBLElBQ1osVUFBWTtBQUFBLElBQ1osWUFBYztBQUFBLElBQ2QsTUFBUTtBQUFBLEVBQ1Y7QUFDRjs7O0FEdkRBLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLFFBQVEsVUFBVSxnQkFBWTtBQUFBLEVBQ2hDO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFFLFNBQVMsQ0FBQztBQUFBLEVBQzVCLFFBQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxXQUFXLEVBQUU7QUFBQSxNQUMvQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
