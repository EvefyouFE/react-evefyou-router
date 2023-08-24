/*
 * @Author: EvefyouFE
 * @Date: 2023-08-10 13:42:48
 * @FilePath: \react-evefyou-router\vite.config.ts
 * @Description: 
 * Everyone is coming to the world i live in, as i am going to the world lives for you. 人人皆往我世界，我为世界中人人。
 * Copyright (c) 2023 by EvefyouFE/evef, All Rights Reserved. 
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import dts from 'vite-plugin-dts';
import pkg from './package.json';

const pathResolve = (v: string) => path.resolve(__dirname, v)

const externalPackages = [...Object.keys(pkg.peerDependencies)]
const regexOfPackages = externalPackages
  .map(packageName => new RegExp(`^${packageName}(\\/.*)?`));

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    minify: true,
    reportCompressedSize: true,
    outDir: '.',
    lib: {
      entry: {
        "index": pathResolve('src/index.ts')
      },
      fileName(format) {
        return `${format}/index.js`
      },
      name: "react-evefyou-router",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        manualChunks: () => {
          return 'index'
        },
        chunkFileNames: () => {
          return '[format]/[name]/index.js'
        },
        assetFileNames: '[ext]/[name].[ext]',
      },
      external: regexOfPackages
    }
  }
})
