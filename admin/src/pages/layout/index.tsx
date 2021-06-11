import React, { FC, useEffect, Suspense, useCallback, useState } from 'react';
import { Layout, Drawer } from 'antd';
import './index.less';
import MenuComponent from './menu';
import HeaderComponent from './header';
import { getGlobalState } from 'utils/getGloabal';
import TagsView from './tagView';
import SuspendFallbackLoading from './suspendFallbackLoading';
import { MenuList, MenuChild } from 'interface/layout/menu.interface';
import { menuListData } from 'utils/menu'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { setUserItem } from 'stores/user.store';
import { useAppDispatch, useAppState } from 'stores';
import { setActiveTag } from 'stores/tags-view.store';

const { Sider, Content } = Layout;
const WIDTH = 992;

const LayoutPage: FC = () => {
  const [menuList, setMenuList] = useState<MenuList>([]);
  const { device, collapsed, newUser } = useAppState(state => state.user);
  const isMobile = device === 'MOBILE';
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard')
    }

  }, [navigate, location]);


  const toggle = () => {
    dispatch(
      setUserItem({
        collapsed: !collapsed
      })
    );
  };

  const initMenuListAll = (menu: MenuList) => {
    const MenuListAll: MenuChild[] = [];
    menu.forEach(m => {
      if (!m?.children?.length) {
        MenuListAll.push(m);
      } else {
        m?.children.forEach(mu => {
          MenuListAll.push(mu);
        });
      }
    });
    return MenuListAll;
  };

  const fetchMenuList = useCallback(() => {
      setMenuList(menuListData);
      dispatch(
        setUserItem({
          menuList: initMenuListAll(menuListData)
        })
      );

    // 高亮 当前初始化路由页面的tab
    menuListData.forEach((item,index)=>{
      if(item.path === location.pathname){
        dispatch(setActiveTag(menuListData[index].key));
      }
    })

  }, [dispatch]);

  useEffect(() => {
    fetchMenuList();
  }, [fetchMenuList]);

  useEffect(() => {
    window.onresize = () => {
      const { device } = getGlobalState();
      const rect = document.body.getBoundingClientRect();
      const needCollapse = rect.width < WIDTH;
      dispatch(
        setUserItem({
          device,
          collapsed: needCollapse
        })
      );
    };
  }, [dispatch]);

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={toggle} />
      <Layout>
        {!isMobile ? (
          <Sider className="layout-page-sider" trigger={null} collapsible collapsed={collapsed} breakpoint="md">
            <MenuComponent menuList={menuList} />
          </Sider>
        ) : (
          <Drawer
            width="200"
            placement="left"
            bodyStyle={{ padding: 0, height: '100%' }}
            closable={false}
            onClose={toggle}
            visible={!collapsed}
          >
            <MenuComponent menuList={menuList} />
          </Drawer>
        )}
        <Content className="layout-page-content">
          <TagsView />
          <Suspense fallback={<SuspendFallbackLoading />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
