import { LazyRouteFunction, RouteObject } from "react-router";

/*
 * @Author: EvefyouFE
 * @Date: 2023-08-15 01:29:05
 * @FilePath: \react-evefyou-router\src\types\route.ts
 * @Description: 
 * Everyone is coming to the world i live in, as i am going to the world lives for you. 人人皆往我世界，我为世界中人人。
 * Copyright (c) 2023 by EvefyouFE/evef, All Rights Reserved. 
 */
export type Recordable<T = any> = Record<string, T>;
export type PageModule = {
    default: React.ComponentType<Recordable | object>;
    // 其他额外的属性
    [key: string]: React.ComponentType<Recordable | object>;
};

export type LazyModule = Promise<PageModule>;
export type LazyModuleFn = () => LazyModule;

export type ModulesObject = Record<string, LazyModuleFn>;

export type RouteModulesObject = Record<string, LazyModuleFn | ModulesObject>;

export type RoutePathConfig = Record<string, RouteModulesObject>;

export interface RouteMenuItem {
    name?: string;
    path: string;
    locale?: string;
}

export type CrRouteObject = Omit<RouteObject, 'children' | 'lazy'> & Omit<RouteMenuItem, 'path'> & {
    children?: CrRouteObject[] | undefined;
    lazy?: LazyRouteFunction<any>;
}

export type WrapComponent = (component: React.ComponentType<any>) => React.ComponentType<any> | null
export type GlobHandleFn = (opt?: CrRouteObject) => any;
export interface CrRouteOptions {
    path?: string;
    wrapComponent?: WrapComponent;
    errorElement?: React.ReactNode;
    loader?: () => Promise<any>;
    handleFn?: GlobHandleFn;
    isIndex?: boolean;
}
export type CrRouteViewConfig = {
    [key: string]: CrRouteOptions;
}