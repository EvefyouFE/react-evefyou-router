/*
 * @Author: EvefyouFE
 * @Date: 2023-08-10 13:42:48
 * @FilePath: \react-evefyou-hooks\vite.config.ts
 * @Description: 
 * Everyone is coming to the world i live in, as i am going to the world lives for you. 人人皆往我世界，我为世界中人人。
 * Copyright (c) 2023 by EvefyouFE/evef, All Rights Reserved. 
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from "@rollup/plugin-typescript";
import path from "path";
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    sourcemap: true,
    rollupOptions: {
      plugins: [typescript({
        sourceMap: true,
        declaration: true,
        outDir: 'dist'
      })],
      external: ['react', 'react-dom', 'ramda', 'react-router', 'react-router-dom']
    }
  }
})
