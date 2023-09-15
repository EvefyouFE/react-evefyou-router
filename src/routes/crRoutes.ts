/*
 * @Author: EvefyouFE
 * @Date: 2023-08-15 01:26:31
 * @FilePath: \react-evefyou-router\src\routes\crRoutes.ts
 * @Description: 
 * Everyone is coming to the world i live in, as i am going to the world lives for you. 人人皆往我世界，我为世界中人人。
 * Copyright (c) 2023 by EvefyouFE/evef, All Rights Reserved. 
 */
import { add, append, assocPath, concat, find, flip, head, includes, indexOf, join, keys, last, map, omit, pickBy, pipe, split, take, uniq } from 'ramda';
import { LazyRouteFunction, RouteObject } from "react-router";
import { crumbLoaderFn } from './props';
import { defaultWrapComponent } from './props/element';
import { CrRouteObject, CrRouteOptions, CrRouteViewConfig, LazyModuleFn, ModulesObject, PageModule, RouteModulesObject, RoutePathConfig } from "../types";

/**
 * routePaths: [$]  [a, b, index] ...
 * paths: [] [/a, /a/b, /a/b/index] ... 
 * @param filePath 
 * @param excludePath 
 * @returns [routePaths, 带'/'的routePaths]
 */
function handleFilePath(filePath: string, excludePath = ''): string[][] {
    const routePaths = filePath
        // 去除 src/pages 不相关的字符
        .replace(excludePath, '')
        // 去除文件名后缀
        .replace(/.tsx?/, '')
        // 转换动态路由 $[foo].tsx => :foo
        .replace(/\$\[([\w-]+)]/, ':$1')
        // 转换以 $ 开头的文件
        .replace(/\$([\w-]+)/, '$1')
        .toLowerCase()
        // 以目录分隔
        .split('/');
    // path改为 '/xx/xx' 格式
    const paths = routePaths
        .filter((path) => path !== '$')
        .reduce((prev, cur) => [...prev, `${prev[prev.length - 1]}/${cur}`], [''] as string[])
        .slice(1);
    return [routePaths, paths];
}

/**
 * 根据 pages 目录生成路径配置
 * { 'path': () => import() } => { 'path': ( { 'path': () => import() } | (() => import()) )  }
 */
function generatePathConfig(modules: ModulesObject, excludePath: string): RouteModulesObject {
    return Object.keys(modules).reduce((acc, filePath) => {
        const pathss = handleFilePath(filePath, excludePath)
        return assocPath(pathss[1].length === 0 ? pathss[0] : pathss[1], modules[filePath], acc);
    }, {});
}

/**
 * 将文件路径配置映射为 react-router 路由
 * { 'path': { 'path': () => import() } | ...  } => routes
 */
function mapPathConfigToRoute(
    cfg: RoutePathConfig,
    options: CrRouteOptions
): CrRouteObject[] {
    const {
        errorElement,
        handleFn,
    } = options

    // route 的子节点为数组
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.entries(cfg).map(([path, child]: [string, LazyModuleFn | ModulesObject]) => {
        // 扩展菜单配置
        const locale = 'menu'.concat(path.replaceAll('/', '.'))
        const name = path.slice(path.lastIndexOf('/') + 1)

        // () => import() 语法判断
        if (typeof child === 'function') {
            // 等于 index 则映射为当前根路由
            const isIndex = path.endsWith('/index');
            const childView = child()
            return {
                index: isIndex,
                path: isIndex ? undefined : path,
                // 转换为组件
                // element: wrapElemnt(child,{isPageView:childWrapPageContainer}),
                lazy: async () => ({ Component: defaultWrapComponent((await childView)?.default) }),
                handle: !isIndex && handleFn?.({ locale }),
                errorElement,
                locale,
                name,
            };
        }
        // 否则为目录，则查找下一层级
        const rest = omit(['$'], child);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const children = mapPathConfigToRoute(rest, options);
        return {
            path,
            // layout 处理
            // element: wrapElemnt($),
            // lazy: async () => ({Component: wrapComponent($)}),
            // 递归 children
            children,
            loader: (children && children.length === 1 && children[0].path === undefined)
                ? undefined
                : crumbLoaderFn({ locale, name, path }, children),
            handle: (children && children.length === 1 && children[0].path === undefined)
                ? handleFn?.({ locale })
                : handleFn?.(),
            errorElement,
            locale,
            name,
        };
    });
}

/**
 * 去掉path为undefined且只有一个的子节点
 * @param routes 
 * @returns 
 */
function handleRoutesUndefinedPath(routes: CrRouteObject[] = []): CrRouteObject[] {
    return routes.reduce((acc, cur) => {
        if (cur && cur.children && cur.children.length === 1 && cur.children[0].path === undefined) {
            return [...acc, {
                ...cur,
                element: cur.children[0].element,
                lazy: cur.children[0].lazy as LazyRouteFunction<RouteObject>,
                children: undefined
            }];
        }
        if (cur && cur.children) {
            return [
                ...acc,
                {
                    ...cur,
                    children: handleRoutesUndefinedPath(cur.children)
                }
            ]
        }
        return [...acc, cur];
    }, [] as CrRouteObject[]);
}

function generateCrRoute(
    viewModules: Record<string, () => Promise<PageModule>>,
    dirPath: string,
    options: CrRouteOptions
) {
    const {
        wrapComponent = defaultWrapComponent,
        loader,
        errorElement,
        isIndex,
        element,
        locale = isIndex ? 'menu.home' : undefined,
        name = isIndex ? 'home' : undefined,
        handleFn,
        path
    } = options
    const handle = isIndex ? handleFn?.({ locale, path }) : undefined

    const { $: $viewFn, ...viewsPathConfig } = generatePathConfig(viewModules as ModulesObject, dirPath);
    const viewRoutes = mapPathConfigToRoute(viewsPathConfig as RoutePathConfig, options);
    const viewRoutesWithoutUndefined = handleRoutesUndefinedPath(viewRoutes);
    const lazy = !element ? async () => ({ Component: wrapComponent((await ($viewFn as LazyModuleFn)()).default) }) : undefined
    return {
        lazy,
        children: viewRoutesWithoutUndefined,
        element,
        errorElement,
        loader,
        handle,
        name,
        locale,
        path
    } as CrRouteObject
}

export function generateCrRoutes(modules: Record<string, () => Promise<PageModule>>, config: CrRouteViewConfig): CrRouteObject[] {
    // const modules = import.meta.glob<PageModule>('/src/pages/**/$*.{ts,tsx}')
    const viewIdx = pipe(
        keys,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        find(includes('views')),
        split('/'),
        indexOf('views'),
        add(1)
    )(modules) as number
    const transformModuleToRoute = (
        v: string
    ) => {
        const view = pipe(
            split('/'),
            take(viewIdx),
            last
        )(v) as string
        const {
            isIndex = view === 'views',
            path = isIndex ? '/' : '/'.concat(view),
            ...rest
        } = config[view]
        const viewModules = pickBy((_, k) => includes(view, k))(modules) as any
        return generateCrRoute(
            viewModules,
            v,
            {
                ...rest,
                isIndex,
                path
            } as CrRouteOptions
        )
    }
    const pagePaths = pipe(
        keys,
        map(
            pipe(
                split('/'),
                take(viewIdx),
                append(['']),
                join('/'),
            )
        ),
        uniq
    )(modules)
    const defaultRoutes = keys(config).reduce((acc, k) => {
        if (!pagePaths.find(p => p.includes(k as string))) {
            const {
                path = '/'.concat(k as string),
                ...rest
            } = config[k]
            acc.push({
                ...rest,
                path
            })
        }
        return acc
    }, [] as CrRouteObject[])
    const routes = pipe(
        map(transformModuleToRoute),
        concat(defaultRoutes)
    )(pagePaths)
    return routes
}
export function generateViewCrRoutes(viewModules: Record<string, () => Promise<PageModule>>, options: CrRouteOptions): CrRouteObject[] {
    const dirPath = pipe(
        keys,
        head,
        split('views'),
        head,
        flip<string, string, string>(concat)('views/')
    )(viewModules)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const viewsPathConfig = generatePathConfig(viewModules as ModulesObject, dirPath);
    const viewRoutes = mapPathConfigToRoute(viewsPathConfig as RoutePathConfig, options);
    const viewRoutesWithoutUndefined = handleRoutesUndefinedPath(viewRoutes);
    return viewRoutesWithoutUndefined
}

export function generateCrViewsPaths(viewModules: Record<string, () => Promise<PageModule>>) {
    // const viewModules = import.meta.glob('/src/pages/views/**/$*.{ts,tsx}');
    const dirPath = pipe(
        keys,
        head,
        split('views'),
        head,
        flip<string, string, string>(concat)('views/')
    )(viewModules)
    return Object.keys(viewModules as object).reduce((acc, filePath) => {
        const pathss = handleFilePath(filePath, dirPath);
        const paths = pathss[1];
        const path = paths?.length > 0 && paths[paths.length - 1]
        if (path && path !== '/index')
            acc.push(path.replace('/index', ''));
        return acc;
    }, [] as string[]);
}



