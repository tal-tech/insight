import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { lacaleConfig } from './locales';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import RenderRouter from './routes';
import { useAppDispatch } from 'stores';
import { setUserItem } from './stores/user.store';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUserItem({ locale: 'zh_CN' }));
    localStorage.setItem('locale', 'zh_CN');
    moment.locale('zh-cn');
  }, []);

  return (
    <ConfigProvider locale={zhCN} componentSize="middle">
      <IntlProvider locale={'zh'} messages={lacaleConfig['zh_CN']}>
        <BrowserRouter>
          <RenderRouter />
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default App;

