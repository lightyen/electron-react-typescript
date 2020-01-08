# appx resources

# 打包成 windows store app (appx)

1. 產生自簽憑證

```shell
electron-builder create-self-signed-cert -p certificate
```

2. 註冊憑證到本機 windows 系統 (powershell administrator)

```powershell
Import-PfxCertificate certificate.pfx -CertStoreLocation Cert:\LocalMachine\TrustedPeople\
```

3. 確認 js 以及各個資源都準備妥當

4. 開始打包

```shell
electron-builder
```

> 設定檔描述在 **electron-builder.toml**

# Refs

- [app-icons-and-logos](https://docs.microsoft.com/en-us/windows/uwp/design/style/app-icons-and-logos)
- [electron-builder](https://www.electron.build/configuration/appx)
