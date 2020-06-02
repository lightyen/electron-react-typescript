# electron-react-typescript

這是一個關於使用 typescript 開發 electron & react 的範例，一個自主學習的產出範例，供我打發時間時使用。

包含其他常見工具，例如：webpack, react-hot-loader, electron-builder 等等

## 開發環境

<a href="https://code.visualstudio.com">
<img src="https://user-images.githubusercontent.com/49339/32078127-102bbcfe-baa6-11e7-8ab9-b04dcad2035e.png" alt="vscode-img" width="10%"/></a>

<a href="https://nodejs.org">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1920px-Node.js_logo.svg.png" alt="nodejs-img" width="15%"/></a>

<a href="https://yarnpkg.com">
<img src="https://raw.githubusercontent.com/yarnpkg/assets/master/yarn-kitten-full.png" alt="yarn-img" width="15%"/></a>

## Prepare

```sh
# Make sure you update the latest version
code -v
node -v
yarn -v
```

## Getting Started

```sh
# clone this repo
git clone https://github.com/lightyen/electron-react-typescript.git

cd electron-react-typescript

# check dependencies
yarn

# start webpack-dev-server
yarn start:renderer

# start nodemon
yarn start:main

# want pack this project?
yarn build
```

> 建議使用 Visual Studio Code 以獲得更佳的開發體驗

## Screenshot

<img src="https://raw.githubusercontent.com/lightyen/electron-react-typescript/resources/screenshot.png" style="display: block; margin-left:auto; margin-right:auto; width: 62%" alt="screenshot">

## 程式碼風格規範

- string 字串 以 雙引號 `"` 表示
- statement 除非特例 否則結尾不用分號 `;`
- 縮排使用 `tab`

## Pack 打包應用程式

- 使用 VSCode 任務「Pack this project」進行應用程式打包（※ Windows 及 MacOS 平台打包需要做 code signing，除了使用自我簽章以外，你可以使用新台幣解決此問題）

## 問題

- React Devtools 在 electron 環境安裝/卸載仍存在許多問題
- 連動 vscode 內置除錯工具仍存在許多問題

## 其他參考

- <https://electronjs.org/docs>
- <https://reactjs.org/>
- <https://www.electron.build/>
