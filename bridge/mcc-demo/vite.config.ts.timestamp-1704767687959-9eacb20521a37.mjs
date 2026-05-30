// vite.config.ts
import { defineConfig } from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/vite@4.4.5_@types+node@20.5.9_less@4.2.0_terser@5.22.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/@vitejs+plugin-react@4.2.0_vite@4.4.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import esbuild from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/rollup-plugin-esbuild@6.1.0_esbuild@0.19.11_rollup@4.9.4/node_modules/rollup-plugin-esbuild/dist/index.mjs";
import babel from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/vite-plugin-babel@1.2.0_@babel+core@7.23.2_vite@4.4.5/node_modules/vite-plugin-babel/dist/index.mjs";
import legacy from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/@vitejs+plugin-legacy@5.2.0_terser@5.22.0_vite@4.4.5/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import { viteCommonjs } from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/@originjs+vite-plugin-commonjs@1.0.3/node_modules/@originjs/vite-plugin-commonjs/lib/index.js";
import AutoImport from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/unplugin-auto-import@0.17.3_rollup@4.9.4/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@4.9.4_vue@3.4.6/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/zhoudongchen/code/slides-engine/node_modules/.pnpm/unplugin-vue-components@0.26.0_rollup@4.9.4_vue@3.4.6/node_modules/unplugin-vue-components/dist/resolvers.js";
var vite_config_default = defineConfig({
  base: "./",
  plugins: [
    viteCommonjs({}),
    react(),
    {
      ...esbuild({
        target: "chrome70",
        // 如有需要可以在这里加 js ts 之类的其他后缀
        include: /\.vue|\.js|.ts|.tsx$/,
        exclude: /node_modules/,
        loaders: {
          ".vue": "js",
          ".ts": "js",
          ".tsx": "js"
        }
      }),
      enforce: "post"
    },
    babel(
      {
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: ["@babel/plugin-transform-runtime"]
        }
      }
    ),
    legacy({
      targets: ["> 0%"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  server: {
    port: 9001,
    host: "0.0.0.0"
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvemhvdWRvbmdjaGVuL2NvZGUvc2xpZGVzLWVuZ2luZS9icmlkZ2UvbWNjLWRlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96aG91ZG9uZ2NoZW4vY29kZS9zbGlkZXMtZW5naW5lL2JyaWRnZS9tY2MtZGVtby92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvemhvdWRvbmdjaGVuL2NvZGUvc2xpZGVzLWVuZ2luZS9icmlkZ2UvbWNjLWRlbW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGVzYnVpbGQgZnJvbSAncm9sbHVwLXBsdWdpbi1lc2J1aWxkJ1xuaW1wb3J0IGJhYmVsIGZyb20gJ3ZpdGUtcGx1Z2luLWJhYmVsJ1xuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXG5pbXBvcnQgeyB2aXRlQ29tbW9uanMgfSBmcm9tIFwiQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWNvbW1vbmpzXCI7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLi8nLFxuICBwbHVnaW5zOiBbdml0ZUNvbW1vbmpzKHt9KSxyZWFjdCgpLHtcbiAgICAuLi5lc2J1aWxkKHtcbiAgICAgIHRhcmdldDogJ2Nocm9tZTcwJyxcbiAgICAgIC8vIFx1NTk4Mlx1NjcwOVx1OTcwMFx1ODk4MVx1NTNFRlx1NEVFNVx1NTcyOFx1OEZEOVx1OTFDQ1x1NTJBMCBqcyB0cyBcdTRFNEJcdTdDN0JcdTc2ODRcdTUxNzZcdTRFRDZcdTU0MEVcdTdGMDBcbiAgICAgIGluY2x1ZGU6IC9cXC52dWV8XFwuanN8LnRzfC50c3gkLyxcbiAgICAgIGV4Y2x1ZGU6IC9ub2RlX21vZHVsZXMvLFxuICAgICAgbG9hZGVyczoge1xuICAgICAgICAnLnZ1ZSc6ICdqcycsXG4gICAgICAgICcudHMnOiAnanMnLFxuICAgICAgICAnLnRzeCc6ICdqcydcbiAgICAgIH0sXG4gICAgfSksXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICB9LCBiYWJlbCh7XG4gICAgYmFiZWxDb25maWc6IHtcbiAgICAgIGJhYmVscmM6IGZhbHNlLFxuICAgICAgY29uZmlnRmlsZTogZmFsc2UsXG4gICAgICBwbHVnaW5zOiBbJ0BiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJ1bnRpbWUnXSxcbiAgICB9XG4gIH1cbiAgKSwgbGVnYWN5KHtcbiAgICB0YXJnZXRzOiBbJz4gMCUnXSxcbiAgICBhZGRpdGlvbmFsTGVnYWN5UG9seWZpbGxzOiBbJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSddXG4gIH0pLFxuICBBdXRvSW1wb3J0KHtcbiAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICB9KSxcbiAgQ29tcG9uZW50cyh7XG4gICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcbiAgfSksXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogOTAwMSxcbiAgICBob3N0OiAnMC4wLjAuMCdcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLltleHRdYCxcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9WLFNBQVMsb0JBQW9CO0FBQ2pYLE9BQU8sV0FBVztBQUNsQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUdwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFBQyxhQUFhLENBQUMsQ0FBQztBQUFBLElBQUUsTUFBTTtBQUFBLElBQUU7QUFBQSxNQUNqQyxHQUFHLFFBQVE7QUFBQSxRQUNULFFBQVE7QUFBQTtBQUFBLFFBRVIsU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1AsUUFBUTtBQUFBLFVBQ1IsT0FBTztBQUFBLFVBQ1AsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFBRztBQUFBLE1BQU07QUFBQSxRQUNQLGFBQWE7QUFBQSxVQUNYLFNBQVM7QUFBQSxVQUNULFlBQVk7QUFBQSxVQUNaLFNBQVMsQ0FBQyxpQ0FBaUM7QUFBQSxRQUM3QztBQUFBLE1BQ0Y7QUFBQSxJQUNBO0FBQUEsSUFBRyxPQUFPO0FBQUEsTUFDUixTQUFTLENBQUMsTUFBTTtBQUFBLE1BQ2hCLDJCQUEyQixDQUFDLDZCQUE2QjtBQUFBLElBQzNELENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLElBQ25DLENBQUM7QUFBQSxFQUFFO0FBQUEsRUFDSCxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
