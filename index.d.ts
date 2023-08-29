import { LazyRouteFunction } from 'react-router';
import { Recordable } from 'react-evefyou-common';
import { RouteObject } from 'react-router';

export declare type CrRouteObject = Omit<RouteObject, 'children' | 'lazy'> & Omit<RouteMenuItem, 'path'> & {
    children?: CrRouteObject[] | undefined;
    lazy?: LazyRouteFunction<any>;
};

export declare interface CrRouteOptions {
    path?: string;
    wrapComponent?: WrapComponent;
    errorElement?: React.ReactNode;
    loader?: () => Promise<any>;
    handleFn?: GlobHandleFn;
    isIndex?: boolean;
}

export declare type CrRouteViewConfig = {
    [key: string]: CrRouteOptions;
};

export declare interface CrumbData {
    title: string;
    menuTreeList?: MenuTreeList;
}

export declare function generateCrRoutes(modules: Record<string, () => Promise<PageModule>>, config: CrRouteViewConfig): CrRouteObject[];

export declare function generateCrViewsPaths(viewModules: Record<string, () => Promise<PageModule>>): string[];

export declare type GlobHandleFn = (opt?: CrRouteObject) => any;

export declare type LazyModule = Promise<PageModule>;

export declare type LazyModuleFn = () => LazyModule;

export declare interface MenuItem {
    /** menu item name */
    name: string;
    /** menu labels */
    label?: {
        zh_CN: string;
        en_US: string;
    };
    /** 图标名称
     *
     * 子子菜单不需要图标
     */
    icon?: string;
    /** 菜单id */
    key: string;
    /** 菜单路由 */
    path: string;
    /** 子菜单 */
    children?: MenuItem[];
    /**
     * 国际化配置
     */
    locale?: string;
}

export declare type MenuTreeList = MenuItem[];

export declare type ModulesObject = Record<string, LazyModuleFn>;

export declare type PageModule = {
    default: React.ComponentType<Recordable | object>;
    [key: string]: React.ComponentType<Recordable | object>;
};

export declare interface RouteMenuItem {
    name?: string;
    path: string;
    locale?: string;
}

export declare type RouteModulesObject = Record<string, LazyModuleFn | ModulesObject>;

export declare type RoutePathConfig = Record<string, RouteModulesObject>;

export declare type WrapComponent = (component: React.ComponentType<any>) => React.ComponentType<any> | null;

export { }
