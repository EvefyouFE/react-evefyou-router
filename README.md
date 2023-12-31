<p align="center">
  <a href="https://ant.design">
    <img width="200" src="">
  </a>
</p>

<h1 align="center">React-Evefyou-Router</h1>

<div align="left">

基于 Vite 的约定式路由树生成库

</div>

中文 | [English](./README.md)

## ✨ Feature

- Based on the conventional routing of Vite and react-router6+, use import.meta.glob to generate PageModule according to the directory structure, and automatically convert it into a routing tree

## 📦 Install

```bash
npm install react-evefyou-router
```

```bash
yarn add react-evefyou-router
```

```bash
pnpm add react-evefyou-router
```

## 🔨 Usage

```
import {generateCrRoutes, PageModule, CrRouteObject, CrRouteConfig} from 'react-evefyou-router'

const modules = import.meta.glob<PageModule>('/src/views/**/$*.{ts,tsx}')
const routesConfig: CrRouteConfig = {
  login: {
    errorElement
  },
  views: {
    loader,
    ...
  }
}
const routes: CrRouteObject[] = generateCrRoutes(modules, routesConfig)
```

### modules format

```
Parse files prefixed with $, as long as they meet the format, it does not need to be Vite
```

```
{
  '/src/views/$.ts': () => import('/src/views/$.ts'),
  '/src/views/dashboard/$index.tsx': () => import('/src/views/dashboard/$index.tsx'),
  '/src/views/dashboard/$Other.tsx': () => import('/src/views/dashboard/$Other.tsx'),
}
```

### Conventional Routing Page structure

| file       | description                     |
| ---------- | ------------------------------- |
| $.ts       | Layout（nested Outlet if need） |
| $index.ts  | default page                    |
| $other.tsx |                                 |

#### common example

```
- pages
    - login (Already built into the library)
        $.ts
    - views
        $.ts (Already built into the library)
        $index.ts
        - dashboard
            $index.tsx
        - project
            $index.tsx
            $List.tsx
    - other
        $.ts
```

#### simple example

```
- views
    $index.ts
    - dashboard
        $index.tsx
    - project
        $index.tsx
        $List.tsx
```
