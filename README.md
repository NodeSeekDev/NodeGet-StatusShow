# NodeGet-StatusShow

一个服务器状态展示页，NodeGet的公开探针页面

欢迎开发者基于此版本进行定制，也欢迎 pr 到本项目

## 开发

```bash
npm i
npm run dev
```

# 部署

build 完是纯静态站 丢哪都行

官方最推荐的方式是下面基于fork的一键部署方式，方便升级至新版

## 一键部署

Fork本仓库 修改public/config.json 然后再cloudflare pages / vercel 直接摁部署 绑定域名
要更新就在GitHub仓库摁 sync就行

## 编译结果下载
官方准备了一份可以直接下载的编译结果，方便需要把静态文件部署到其他地方的用户
此下载链接始终与最新版保持一致，利用cloudflare pages自动编译生成
<https://nodeget.pages.dev/nodeget-statusshow.zip>

## 环境变量
如果不想编辑修改public/config.json，可以利用环境变量在预编译阶段自动生成public/config.json

预编译阶段会检查是否有对应的环境变量，如果没有相关环境变量则默认不进行预编译


> 环境变量是 **build 时** 注入的 改完之后必须重新部署一次才会生效 在面板里光改不重新跑 build 是没用的

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
