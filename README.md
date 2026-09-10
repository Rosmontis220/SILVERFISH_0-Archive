# SILVERFISH_0 Archive

断联前后的完整记录。

## 结构

```
SILVERFISH_0-Archive/
│
├── index.html          # 主页面（版本选择）
├── README.md           # 说明文档
│
├── wiki/               # 调查维基（断联前后）
│   ├── v1/             # 断联前 v1（20篇原始版本）
│   │   ├── index.html
│   │   ├── app.js
│   │   ├── style.css
│   │   ├── content.js
│   │   ├── 密码.txt
│   │   ├── readme.zip
│   │   └── 404.html
│   ├── v2/             # 断联前 v2（21篇更新版本）
│   │   ├── index.html
│   │   ├── app.js
│   │   ├── style.css
│   │   ├── content.js
│   │   ├── 密码.txt
│   │   ├── readme.zip
│   │   └── 404.html
│   └── v3/             # 断联后（GOD SAYS）
│       ├── index.html
│       ├── app.js
│       ├── style.css
│       ├── god.m4a
│       └── background.png
│
├── forecast/           # 大黄昏预测网页（补档）
    ├── v1/             # commit 3344017 时的第一版
    │   └── index.html
    └── v2/             # 当前仓库 HEAD 的第二版
        ├── index.html
        └── GDF-ALERT-LEVEL-III.mp3
│
└── localized/          # 汉化模块（英文页面中文版）
    ├── forecast-v1/    # 大黄昏预测 v1 汉化
    │   └── index.html
    └── forecast-v2/    # 大黄昏预测 v2 汉化（加密页，音频引用原版）
        └── index.html
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

### 大黄昏预测 (补档自 great-dusk-forecast)

该网页原部署于 `https://github.com/Silverfish-0/great-dusk-forecast`，此前未纳入本存档。

#### forecast/v1（commit `3344017`）
- 单页预报：GREAT DUSK FORECAST
- 预报仍在进行：持续时间 ≈ 1 个人类月份，预警等级 ELEVATED

#### forecast/v2（当前仓库 HEAD）
- 预报状态终止，页面转为本地位记录
- `index.html` 为加密外壳，浏览器会自动解密并显示事件页
- 附带 `GDF-ALERT-LEVEL-III.mp3`（Level III 警报音频，与事件页同目录）

两版页面均未沿用 Ctrl+Q 快捷键，改用右下角可见的「返回存档索引」按钮返回本目录。

### 汉化 (localized)

把原本全英文的两份大黄昏预测页面翻译成中文，原版页面保持不动：

- `localized/forecast-v1/`：预测页中文版（版式、配色与交互与原版一致）
- `localized/forecast-v2/`：事件页中文版，仍为加密壳，解密后为中文内容；保留手动警报门禁，音频引用原版 `forecast/v2/GDF-ALERT-LEVEL-III.mp3`

## 留档文件（在 wiki/v1/ 和 wiki/v2/ 中）

### 密码.txt
解密密码：`INSIGHTFUTURETHROUGHTHEFOG`

### readme.zip
原始加密文件，包含"巨爆大黄昏预言"的计划代号

## 使用方法

### 本地浏览
直接打开 `index.html`，点击对应版本。

### 独立访问
- `wiki/v1/index.html` - 20篇原始版本
- `wiki/v2/index.html` - 21篇更新版本
- `wiki/v3/index.html` - GOD SAYS
- `forecast/v1/index.html` - 大黄昏预测第一版
- `forecast/v2/index.html` - 大黄昏预测第二版（加密页，需 WebCrypto 自动解密）
- `localized/forecast-v1/index.html` - 大黄昏预测第一版汉化
- `localized/forecast-v2/index.html` - 大黄昏预测第二版汉化

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
