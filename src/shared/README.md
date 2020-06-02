# Shared

IPC 處理，是介於 main/renderer 之間的膠水層

## Usage

- *preload.js* - 在 renderer process 中初始化 shared 界面
- *register.js* - 在 main process 中初始化 shared 界面
- *model* - 在 main/renderer 之間共用的資料模型
- *ipc* - 包含所有溝通渠道
