# SILVERFISH_0 Archive

断联前后的完整记录。

## 结构

```
SILVERFISH_0-Archive/
│
├── index.html          # 主页面（版本选择）
├── README.md           # 说明文档
│
├── v1/                 # 断联前 v1（20篇原始版本）
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── content.js
│   ├── 密码.txt
│   ├── readme.zip
│   └── 404.html
│
├── v2/                 # 断联前 v2（21篇更新版本）
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── content.js
│   ├── 密码.txt
│   ├── readme.zip
│   └── 404.html
│
└── god/                # 断联后（GOD SAYS）
    ├── index.html
    ├── app.js
    ├── style.css
    ├── god.m4a
    └── background.png
```

## 版本说明

### 断联前 v1 (20篇)
原始版本，不包含《断联协议》

### 断联前 v2 (21篇)
- 新增《断联协议》
- 扩充《锚点假说》(+182字符)、《术语表》(+114字符)
- 重构《大黄昏预言》→《巨爆大黄昏》
- 精简《两个闻舟》(-81字符)

### 断联后 (GOD SAYS)
- content.js 被删除
- 16种语言启示
- 50哀歌 + 20系统错误 + 16狂热宣言
- Somniomancer [null set] 音频 (Crywolf)

## 留档文件（在 v1/ 和 v2/ 中）

### 密码.txt
解密密码：`INSIGHTFUTURETHROUGHTHEFOG`

### readme.zip
原始加密文件，包含"巨爆大黄昏预言"的计划代号

## 使用方法

### 本地浏览
直接打开 `index.html`，点击对应版本。

### 独立访问
- `v1/index.html` - 20篇原始版本
- `v2/index.html` - 21篇更新版本
- `god/index.html` - GOD SAYS

### GitHub Pages 部署

```bash
cd SILVERFISH_0-Archive
git init
git add .
git commit -m "SILVERFISH_0 完整存档"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

然后在仓库 Settings → Pages 中启用。
