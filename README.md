# electron-react-typescript

This is a template project about building electron application with typescript and react, I use it to kill my time.

## Environment

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

> recommend using vscode

## Screenshot

<img src="https://raw.githubusercontent.com/lightyen/electron-react-typescript/resources/screenshot.png" style="display: block; margin-left:auto; margin-right:auto; width: 62%" alt="screenshot">

## Pack this application

- Run `yarn build`

## issue

- React Devtools has a lot problem in electron
- Combine development environment with vscode debugger is diffcult

## links

- <https://electronjs.org/docs>
- <https://reactjs.org/>
- <https://www.electron.build/>
