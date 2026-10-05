# 邮路控制台

控制器只在 `viewer.html` 的同源浏览外壳中注入。`archive/postal-terminal/v1–v5/` 内的原版 `index.html` / `404.html` 不包含控制台引用，也没有替换原混淆脚本、内嵌二进制或拦截 fetch。

从 silverfish 工作区启动预览：

```powershell
python -m http.server 8835 --bind 127.0.0.1
```

首页：http://127.0.0.1:8835/SILVERFISH_0-Archive/index.html

终端：http://127.0.0.1:8835/SILVERFISH_0-Archive/viewer.html?path=archive%2Fpostal-terminal%2Fv5%2Findex.html

五版分别支持 1、2、3、4、5 枚邮票；v2 起支持身份，v3 起支持完整终端，v5 增加联合处置文件入口。解锁使用原页面输入与按钮。导入进度码合并当前版本支持项，不自动删除已有进度。重置清理当前版本的键并刷新，跨版本共用键也会受影响。

控制台操作会通过 `viewer.html` 的音效桥接播放 `resources/sfx/legacy/` 中的本地 UI 音效。
