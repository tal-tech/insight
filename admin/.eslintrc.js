module.exports = {
  plugins: ["react", "@typescript-eslint"],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // 表示启动JSX
    },
    ecmaVersion: 2018, // 指定支持版本
    sourceType: "module", //指定来源的类型，有两种script module
    project: "./tsconfig.json",
  },
  rules: {
    "no-unused-vars": "off",
    "linebreak-style": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "import/prefer-default-export": "off",
    "no-param-reassign": "off",
    "react/jsx-props-no-spreading": "off",
    "no-plusplus": "off",
    "prefer-destructuring": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "import/no-extraneous-dependencies": "off",
    "react/destructuring-assignment": "off",
    "react/button-has-type": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react/require-default-props": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "react/jsx-no-target-blank": "off",
  },
};
