import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  // Priority: explicit VITE_BASE_PATH -> custom domain CNAME / Vercel / Cloudflare Pages ('/') -> GitHub repo subpath -> relative './'
  const hasCname = fs.existsSync(path.resolve(process.cwd(), 'public/CNAME'));
  const explicitBase = process.env.VITE_BASE_PATH?.trim();
  const isRootStaticHost = process.env.VERCEL === '1' || process.env.CF_PAGES === '1';
  const repoName = explicitBase
    ? explicitBase
    : hasCname || isRootStaticHost
    ? '/'
    : process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : './';

  return {
    base: repoName,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'apple-touch-icon.png',
          'assets/aistudio/image_0883e005.png'
        ],
        manifest: {
          id: './',
          name: 'Synapse - Học viện STEM Mô phỏng 2D/3D',
          short_name: 'Synapse',
          description:
            'Nền tảng mô phỏng Toán, Vật lí, Tin học, Học cảm giác 3D/2D bằng cử chỉ tay và Syn AI cho Laptop, Android và iPhone.',
          theme_color: '#0f172a',
          background_color: '#050914',
          display: 'standalone',
          orientation: 'any',
          scope: './',
          start_url: './',
          categories: ['education', 'science', 'utilities'],
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          globIgnores: [
            '**/mediapipe/**',
            '**/vendor-three*',
            '**/vendor-mediapipe*',
            '**/vendor-docs*',
            '**/vendor-ai*',
            '**/vendor-katex*',
            '**/vendor-firebase*',
            '**/vendor-motion*',
            '**/lectureStepsBuilder*',
            '**/FutureLabWorkspace*',
            '**/SpatialGesture3DLab*',
            '**/examData*',
            '**/physicsLessonsData*',
            '**/curriculumData*',
            '**/csLessonsData*',
            '**/PhysicsLab*',
            '**/CodeJudgeLab*',
            '**/AlgorithmVisualizer*',
            '**/ArenaHub*',
            '**/ExamHub*',
            '**/MathSimulationsPage*',
            '**/InteractiveLectureRoom*',
            '**/LearningRoadmap*',
            '**/SocraticAITutor*',
            '**/KaTeX_*'
          ],
          navigateFallbackDenylist: [/^\/api\//, /\/mediapipe\//, /\/downloads\//],
          runtimeCaching: [
            {
              urlPattern: /\/assets\/.*\.(js|css|woff2?|ttf|woff)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'synapse-lazy-assets',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 14
                }
              }
            },
            {
              urlPattern: /\/mediapipe\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'synapse-mediapipe-cache',
                expiration: {
                  maxEntries: 12,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'synapse-google-fonts',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkOnly'
            }
          ]
        },
        devOptions: {
          enabled: false
        }
      })
    ],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('/three/')) {
              return 'vendor-three';
            }
            if (id.includes('@mediapipe')) {
              return 'vendor-mediapipe';
            }
            if (id.includes('/firebase/') || id.includes('@firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('/docx/') || id.includes('/jszip/') || id.includes('/qrcode/')) {
              return 'vendor-docs';
            }
            if (id.includes('/katex/')) {
              return 'vendor-katex';
            }
            if (id.includes('/@google/genai/')) {
              return 'vendor-ai';
            }
            if (id.includes('/motion/') || id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return undefined;
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
      dedupe: ['react', 'react-dom', 'three'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'three', 'lucide-react'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
