# electron-react-typescript

這是一個關於用 typescript 開發 electron & react 的範本，一個自主學習的產出範例，供打發時間時使用

整合其他功能，例如：webpack, react-hot-loader, electron-builder 等等

## 開發環境

<a href="https://code.visualstudio.com">
<img src="https://user-images.githubusercontent.com/49339/32078127-102bbcfe-baa6-11e7-8ab9-b04dcad2035e.png" alt="vscode-img" width="10%"/></a>

<a href="https://nodejs.org">
<img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" alt="nodejs-img" width="15%"/></a>

<a href="https://yarnpkg.com">
<img src="https://raw.githubusercontent.com/yarnpkg/assets/master/yarn-kitten-full.png" alt="yarn-img" width="15%"/></a>

## 安裝完後檢查環境是否正確運作

```shell
code -v
node -v
yarn -v
```

## 如何開始

```shell
# clone this repo
git clone https://github.com/lightyen/electron-react-typescript

# 進入專案資料夾
cd electron-react-typescript

# 檢查或下載 dependencies
yarn

# start webpack-dev-server
yarn run webpack-development

# start electron
yarn start

# or pack project
yarn build
```

> 建議使用 Visual Studio Code 以獲得更佳的開發體驗

## 使用 Visual Studio Code 開發

安裝相關 Visual Studio Code 擴充元件

- [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [**Debug for Firefox**](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)
- [**Debug for Chrome**](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [**Prettier**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [**stylelint**](https://marketplace.visualstudio.com/items?itemName=thibaudcolas.stylelint)
- [**EditorConfig for VS Code**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [**Tailwind CSS IntelliSence**](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### 快速開始

1. 在 VSCode 的偵錯頁面（Ctrl+Shift+D），選擇「Debug」，最後按下「F5」啟動偵錯

> 其他詳細資訊描述在：**.vscode/launch.json**

## Screenshot

<img src="https://raw.githubusercontent.com/lightyen/electron-react-typescript/resources/screenshot.png" style="display: block; margin-left:auto; margin-right:auto; width: 62%" alt="screenshot">

## 程式碼風格規範

- string 字串 以 雙引號 `"` 表示
- statement 除非特例 否則結尾不用分號 `;`

## editorconfig, prettier 風格

偏好縮排為 **4** 個空格

## Pack 打包應用程式

- 使用 VSCode 任務「Pack this project」進行應用程式打包（※ Windows 及 MacOS 平台打包需要做 code signing，除了使用自我簽章以外，你可以使用台幣或美金解決此問題）

## 其他參考連結

- https://electronjs.org/docs
- https://reactjs.org/
- https://www.typescriptlang.org/docs/home.html
- https://www.electron.build/
