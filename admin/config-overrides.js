const { override, addLessLoader } = require('customize-cra');
const path = require('path');
const rewiredSourceMap = () => config => {
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  return config;
};

module.exports = override(
    addLessLoader({
      modifyVars: {
        '@primary-color': 'rgb(24, 144, 255)'
      },
      javascriptEnabled: true
    }),
    // new BundleAnalyzerPlugin(),
    rewiredSourceMap(),
    (config) => {
      if(process.env.NODE_ENV === 'production'){
        //暴露webpack的配置 config ,evn
        const paths = require('react-scripts/config/paths');
        // 配置打包目录输出到dist/ 目录中
        paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');
        config.output.path = paths.appBuild;
        // 配置访问子目录/
        paths.publicUrlOrPath = './'
        config.output.publicPath = './'
      }

      return config
    }
);
