import React, { lazy, FC } from 'react';

import Dashboard from 'pages/dashboard';
import LoginPage from 'pages/login';
import LayoutPage from 'pages/layout';
import { PartialRouteObject } from 'react-router';
import WrapperRouteComponent from './config';
import { useRoutes } from 'react-router-dom';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ 'pages/404'));
const Burying = lazy(() => import(/* webpackChunkName: "404'"*/ 'pages/burying'));
const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ 'pages/permission/route'));
const ButtonPermission = lazy(() => import(/* webpackChunkName: "button-permission"*/ 'pages/permission/button'));
const PermissionConfig = lazy(() => import(/* webpackChunkName: "permission-config'"*/ 'pages/permission/config'));

const routeList: PartialRouteObject[] = [
  {
    path: 'login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />
  },
  {
    path: '',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: [
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />
      },
      {
        path: 'burying',
        element: <WrapperRouteComponent element={<Burying />} titleId="title.burying" />
      },
      {
        path: 'permission/route',
        element: <WrapperRouteComponent element={<RoutePermission />} titleId="title.permission.route" auth />
      },
      {
        path: 'permission/button',
        element: <WrapperRouteComponent element={<ButtonPermission />} titleId="title.permission.button" />
      },
      {
        path: 'permission/config',
        element: <WrapperRouteComponent element={<PermissionConfig />} titleId="title.permission.config" />
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />
      }
    ]
  }
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;

