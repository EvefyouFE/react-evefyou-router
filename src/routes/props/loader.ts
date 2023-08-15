/*
 * @Author: EvefyouFE
 * @Date: 2023-08-15 01:26:31
 * @FilePath: \react-evefyou-router\src\routes\props\loader.ts
 * @Description: 
 * Everyone is coming to the world i live in, as i am going to the world lives for you. 人人皆往我世界，我为世界中人人。
 * Copyright (c) 2023 by EvefyouFE/evef, All Rights Reserved. 
 */
import { CrumbData, MenuTreeList } from "../../types/menu";
import { CrRouteObject, RouteMenuItem } from "../../types/route";



export function crumbLoaderFn(
    routeMenuItem?: RouteMenuItem,
    routes?: CrRouteObject[]
): () => CrumbData {
    return () => ({
        title: routeMenuItem?.locale ? routeMenuItem?.locale : routeMenuItem?.name || '',
        menuTreeList: routes?.reduce((acc, cur) => cur && [...acc, {
            locale: cur.locale,
            name: cur.name || '',
            path: cur.path || '',
            key: cur.path || ''
        }], [] as MenuTreeList)
    })
}

