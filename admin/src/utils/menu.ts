import { MenuList } from 'interface/layout/menu.interface';

export const menuListData: MenuList = [
  {
    name: 'dashboard',
    label: {
      zh_CN: '首页',
      en_US: 'Dashboard'
    },
    icon: 'dashboard',
    key: '0',
    path: '/dashboard'
  },
  {
    name: 'burying',
    label: {
      zh_CN: '全埋点',
      en_US: 'Burying'
    },
    icon: 'burying',
    key: '1',
    path: '/burying'
  }
  // 多级菜单配置如下
  // {
  //   name: 'permission',
  //   label: {
  //     zh_CN: '权限',
  //     en_US: 'Permission'
  //   },
  //   icon: 'permission',
  //   key: '3',
  //   path: '/permission',
  //   children: [
  //     {
  //       name: 'routePermission',
  //       label: {
  //         zh_CN: '路由权限',
  //         en_US: 'Route Permission'
  //       },
  //       key: '2-0',
  //       path: '/permission/route'
  //     },
  //     {
  //       name: 'buttonPermission',
  //       label: {
  //         zh_CN: '按钮权限',
  //         en_US: 'Button Permission'
  //       },
  //       key: '2-1',
  //       path: '/permission/button'
  //     },
  //     {
  //       name: 'permissionConfig',
  //       label: {
  //         zh_CN: '权限配置',
  //         en_US: 'Permission Config'
  //       },
  //       key: '2-2',
  //       path: '/permission/config'
  //     },
  //     {
  //       name: 'notFound',
  //       label: {
  //         zh_CN: '404',
  //         en_US: '404'
  //       },
  //       key: '2-3',
  //       path: '/permission/404'
  //     }
  //   ]
  // }
];
