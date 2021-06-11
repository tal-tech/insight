import React, { FC } from 'react';
import { LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactSVG from 'assets/logo/react.svg';
import { logoutAsync } from 'stores/user.store';
import { useAppDispatch, useAppState } from 'stores';

const { Header } = Layout;

interface Props {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<Props> = ({ collapsed, toggle }) => {
  const { logged, device } = useAppState(state => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'logout':
        const res = Boolean(await dispatch(logoutAsync()));
        res && navigate('/login');
        return;
    }
  };

  const toLogin = () => {
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span>
          <LogoutOutlined />
          <span onClick={() => onActionClick('logout')}>
            <span>退出登陆</span>
          </span>
        </span>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="layout-page-header">
      {device !== 'MOBILE' && (
        <div className="logo" style={{ width: collapsed ? 80 : 200 }}>
          <img src={ReactSVG} alt="" style={{ marginRight: collapsed ? '2px' : '20px' }} />
        </div>
      )}
      <div className="layout-page-header-main">
        <div onClick={toggle}>
          <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </div>
        {/*<div className="actions">*/}
        {/*  {logged ? (*/}
        {/*    <Dropdown overlay={menu} trigger={['click']}>*/}
        {/*      <span className="user-action">*/}
        {/*        <img src={XHBLogo} className="user-avator" alt="avator" style={{ borderRadius: '5px' }} />*/}
        {/*      </span>*/}
        {/*    </Dropdown>*/}
        {/*  ) : (*/}
        {/*    <span style={{ cursor: 'pointer' }} onClick={toLogin}>*/}
        {/*      <span>登陆</span>*/}
        {/*    </span>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    </Header>
  );
};

export default HeaderComponent;

