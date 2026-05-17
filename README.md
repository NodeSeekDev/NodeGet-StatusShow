# NodeGet-StatusShow

一个服务器状态展示页，NodeGet的公开探针页面

欢迎开发者基于此版本进行定制，也欢迎 pr 到本项目

## 开发

```bash
npm i
npm run dev
```
## 一键部署
一键部署需要主控的版本在0.2.6以上，请先到[控制面板](https://dash.nodeget.com/#/dashboard/node-manage?tab=servers)查看主控版本

<a href="https://dash.nodeget.com/#/dashboard/theme-management?add=https://nodeget.pages.dev">
  <img src="https://dash.nodeget.com/deploy-button.png" alt="deploy button" width="230px" />
</a>


## 基于静态文件部署

本项目 build 完是纯静态站， 丢哪都行

官方准备了一份可以直接下载的编译结果，方便需要把静态文件部署到其他地方的用户

此下载链接始终与最新版保持一致，利用cloudflare pages自动编译生成

<https://nodeget.pages.dev/NodeGet-StatusShow.zip>

下载后修改 config.json 的信息，然后可以上传到任意静态文件服务，如 nginx、 cloudflare pages、vercel

## 基于 cloudflare pages编译部署

此为官方最推荐的部署方式，方便升级至新版

Fork本仓库, 然后在cloudflare pages / vercel 直接部署，绑定域名

设定环境变量 `NODEGET_CONFIG`，需要是有效的JSON字符串

```json
{
  "user_preferences":{
    "site_name": "NodeGet Status",
    "site_logo": "",
    "footer": "Powered by NodeGet"
  },
  "site_tokens": [
    {
      "name": "master server node 1",
      "backend_url": "wss://your-backend.example.com",
      "token": "YOUR_TOKEN_HERE"
    }
  ]
}
```

要更新版本则就在 fork 的 GitHub 仓库点击 sync 就行，可以轻松且可控的升级

> 环境变量是 **build 时** 注入的 改完之后必须重新部署一次才会生效 在面板里光改不重新跑 build 是没用的

## 环境变量(旧版)

旧版没有充分考虑扩展性，只支持有限的环境变量

```
SITE_NAME=狼牙的探针
SITE_LOGO=https://example.com/logo.png
SITE_FOOTER=Powered by NodeGet
SITE_1=name="master-1",backend_url="wss://m1.example.com",token="abc123"
SITE_2=name="master-2",backend_url="wss://m2.example.com",token="xyz789" 
```

前三个对应 `site_name` / `site_logo` / `footer` 不写就用默认值

`SITE_n` 是主控 值用 `key="value"` 拿逗号串起来 支持 `name` / `backend_url` / `token` 三个字段 值里要塞引号或反斜杠的话用 `\"` 和 `\\` 转义

从 `SITE_1` 开始连续往上数 中间断了就停 所以加新主控接着 `SITE_3` `SITE_4` 就行

一个 `SITE_n` 都没设的话脚本啥也不干 直接用仓库里那份 `config.json` 本地 `npm run dev` 走的是 vite 直接起 也不会触发这个脚本

可以只有一个 `SITE` 不强制 `SITE_2` `SITE_3` 之类的
