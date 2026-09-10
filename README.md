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
├── number-of-motion/   # 运动之数（失联后发布）
│   ├── README.md       # 发布方随附说明
│   └── files/          # 解压后的发布文件
│       ├── CHECKSUMS.txt
│       ├── last-local-record.html
│       ├── local-copy.html
│       └── local-continuity-probe-0.1.0.jar
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

### 运动之数 (number-of-motion)

来自仓库 `https://github.com/Silverfish-0/number-of-motion`，以及 2026-09-10 的 B 站动态《失联以后，这边还在走》。
这是一个 Minecraft 侧的小模组谜题，不是网页存档，因此单独成一个模块：

- `files/local-continuity-probe-0.1.0.jar`：Local Continuity Probe／本地连续性探针 v0.1.0，环境 Minecraft Java 1.20.1 + Forge 47.4.10
- `files/last-local-record.html`：本地记录，加密外壳，需在浏览器内输入密钥解封
- `files/local-copy.html`：本地副本，同为加密外壳
- `files/CHECKSUMS.txt`：发布方自述的注意事项与三个文件的 SHA-256

三个文件按发布时的原始字节保存，未做任何改动，SHA-256 与 `CHECKSUMS.txt` 完全一致。
首页只收录两份记录网页，模组与说明按原样留在目录里，不进入首页模块。

两份记录网页在文件末尾追加了一段返回入口（单行标记 `SF0-ARCHIVE-RETURN-BEGIN` … `SF0-ARCHIVE-RETURN-END`），
这是全文唯一的改动：原有内容一个字节没动，追加块只负责往页面上注入右下角的返回按钮。
追加块 1133 字节，紧接在原件之后，截断回 8584 字节（`last-local-record.html`）或 4656 字节（`local-copy.html`）
即可还原原件、重新对上 `CHECKSUMS.txt`。追加块不含换行符，所以仓库里的字节与 GitHub Pages 提供的一致。
`local-copy.html` 的追加块以一个 `</script>` 开头——它末尾原有内容没有闭合脚本标签，不补这一下，追加的代码不会被解析执行。

| 文件 | 原件 SHA-256 | 追加后 SHA-256 |
| --- | --- | --- |
| `last-local-record.html` | `d525670114f1f084c36bcf60daad13b29293c099f3a06ad6f757d8ebe501c09f` | `8aa4e8722380571ed97187aebf24738ae7de2e710860090b99f2b868bda4e45f` |
| `local-copy.html` | `866d44866e9d30836bc75869b423fa7fa95c72af084b844521e1d7db938d7c3f` | `91fa0bbefd539696d4550898a438ea49fb19018263c6a3bd62b897a673bd9570` |

发布方在说明里要求：不要上传到所谓在线解密站，也不要把这件事扩展成对任何现实人物的调查；模组不联网、不上传数据。

### 杂项 (MISC)

外部入口，汇总在首页第四个模块：

- B站 · XIKM HLQA ONYIEN：`https://space.bilibili.com/3493126603803061`
- 抖音 · VHQ-4K/19：分享主页链接
- 腾讯文档 · XIKM HLQA ONYIEN 解谜：`https://docs.qq.com/doc/DZURVVXJkS1NZWFNq`
- B站 · Silverfish_0：`https://space.bilibili.com/1239867708`
- 迷雾论坛：`https://www.mistarg.cn/`
- QQ 群链接：`https://qm.qq.com/q/EICZzM2KTC`

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
- `number-of-motion/files/last-local-record.html` - 本地记录（加密）
- `number-of-motion/files/local-copy.html` - 本地副本
- `number-of-motion/files/local-continuity-probe-0.1.0.jar` - 本地连续性探针模组
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
