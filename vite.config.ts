
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'lovable-uploads/*.png'],
      manifest: {
        name: "SceneVox - Film Distribution Platform",
        short_name: "MoodSwang",
        description: "Turn your films into fortune with professional distribution and monetization",
        theme_color: "#FFCC00",
        background_color: "#000000",
        icons: [
          {
            src: '/lovable-uploads/0d52698e-5b20-4505-a780-227a7f6d6a1a.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/lovable-uploads/130ac2b7-3097-4b9f-91af-63edb898f0eb.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/lovable-uploads/0d52698e-5b20-4505-a780-227a7f6d6a1a.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Add special handling for lovable uploads
            urlPattern: /lovable-uploads\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'custom-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure proper ES module output
    target: 'esnext',
    outDir: 'dist',
    // Generate service worker
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
