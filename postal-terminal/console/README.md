# 邮路控制台（仅本地）

共享控制器和样式位于存档仓库外。存档 v1–v4 的 index.html / 404.html 仅追加带版本号的相对脚本引用。没有替换原混淆脚本、内嵌二进制或拦截 fetch。

从 silverfish 工作区启动预览：

```powershell
python -m http.server 8835 --bind 127.0.0.1
```

首页：http://127.0.0.1:8835/SILVERFISH_0-Archive/index.html

终端：http://127.0.0.1:8835/SILVERFISH_0-Archive/postal-terminal/v4/index.html

四版分别支持 1、2、3、4 枚邮票；v2 起支持身份，v3 起支持完整终端。解锁使用原页面输入与按钮。导入进度码合并当前版本支持项，不自动删除已有进度。重置清理当前版本的键并刷新，跨版本共用键也会受影响。

本目录不在存档 Git 仓库中；外部相对引用只用于本地预览。请勿直接把这些引用当成线上部署配置。
