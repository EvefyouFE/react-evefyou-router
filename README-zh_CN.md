<p align="center">
  <a href="https://ant.design">
    <img width="200" src="">
  </a>
</p>

<h1 align="center">React-Evefyou-Router</h1>

<div align="left">

Conventional routing tree generation library based on Vite and react-router6+

</div>

中文 | [English](./README.md)

## ✨ 特性

- 基于 Vite 和 react-router6+ 的约定式路由，根据目录结构使用 import.meta.glob 生成 PageModule，自动解析为路由树

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

## 🔨 使用

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

### modules 格式

```
解析以$为前缀的文件，满足格式即可，可以不是 Vite
```

```
{
  '/src/views/$.ts': () => import('/src/views/$.ts'),
  '/src/views/dashboard/$index.tsx': () => import('/src/views/dashboard/$index.tsx'),
  '/src/views/dashboard/$Other.tsx': () => import('/src/views/dashboard/$Other.tsx'),
}
```

### 约定目录结构

| 格式      | 说明                       |
| --------- | -------------------------- |
| $.ts      | Layout 层（可嵌套 Outlet） |
| $index.ts | 默认页面                   |
| $其他     | 默认页面                   |

#### 通用例子

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

#### 最简例子

```
- views
    $index.ts
    - dashboard
        $index.tsx
    - project
        $index.tsx
        $List.tsx
```
