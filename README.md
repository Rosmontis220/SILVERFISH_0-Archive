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
├── postal-terminal/    # 邮路终端（作者换号后发布）
│   ├── index.html      # 30 个邮票槽位，单页应用
│   ├── 404.html        # 与 index.html 字节相同
│   ├── first-stamp.png # 2.9 MB，雨前首封
│   └── life-flow.mp3   # 7.5 MB，背景音乐
│
└── localized/          # 汉化模块（英文页面中文版）
    ├── forecast-v1/    # 大黄昏预测 v1 汉化
    │   └── index.html
    └── forecast-v2/    # 大黄昏预测 v2 汉化（加密页，音频引用原版）
        └── index.html
```

## 首页网格

`index.html` 里所有模块共用一条卡片网格规则，列数完全跟着可用宽度走：

```css
.card-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));                  /* 兜底 */
  grid-template-columns: repeat(auto-fit, minmax(max(250px, 25% - 12px), 1fr)); /* 生效 */
}
```

轨道最小宽度取「250px」与「四等分减掉三个 16px 间隙」的较大者，于是宽屏最多排四列，
变窄时自动降到三列、两列、一列，全程没有任何 `@media` 断点，以后加卡片也不用再调列数。
实测列数变化：1600px 起四列 → 1200px 三列 → 1000px 两列 → 520px 一列。

卡片内部用容器查询跟着列宽缩放，同样不需要断点：

```css
.card-grid > .entry-card { container-type: inline-size; }
@container (max-width: 330px) { .card-title { font-size: 17px; } }
```

注意容器查询只能命中容器的后代，`.entry-card` 自身的内边距改不了，所以收紧的是标题和底栏。
`文件下载` 模块额外挂一个 `.card-grid--clamp2`，把描述限制在两行。

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

#### 解封密钥与来源

`last-local-record.html` 的解封密钥是 `20260810`。

来源是 2026 年 8 月 10 日《泰拉瑞亚》大型模组「灾厄」(Calamity Mod) 宣布全面停止开发与更新的公告日。
发布动态里那段话就是提示：「还有一个沙盒游戏，世界是在一张纸上的。那边有个叫大型模组，做了十年。后来它停更了。悼念。」
——一张纸上的沙盒游戏指 2D 横版世界的泰拉瑞亚，做了十年后停更的大型模组指灾厄。

### 邮路终端 (postal-terminal)

来自仓库 `https://github.com/0-silverfish/postal-terminal`，作者称原账号 `Silverfish-0` 遭攻击后换号，新号即 `0-silverfish`。
单个自包含的 `index.html`（69,845 字节），无外链、无构建步骤，全部逻辑内嵌：

- 30 个邮票槽位，首个位置默认解锁，其余保持静默，页面不给任何提示
- 启动进度条：5 秒定时，缓动曲线 `1-(1-t)³`，6 段状态文案
- 背景音乐 `life-flow.mp3`，默认音量 0.52
- 内部有 6 位坐标答案 `6825`，是页面内的谜题，不是个人信息

页面里有一段写给某位收件人的 `<template data-postal-fragment>` 碎片，原文含真实 ID 与 QQ 号。
本存档发布前已脱敏，把这两项分别替换为 `某群友ID`、`某群友QQ号`：

```html
<template data-postal-fragment="某群友ID">某群友QQ号，我知道是你。……这是我给你的礼物。</template>
```

这段碎片是惰性的：解密后的页面逻辑从不引用 `template`、`postal-fragment` 或该属性值，
所以替换它不影响页面任何功能，仅去掉原文里的真实身份信息。
（原件上游 `https://0-silverfish.github.io/postal-terminal/` 仍是未脱敏版本，本仓库无法追溯修改。）

`index.html` 与 `404.html` 在原件状态下字节完全相同（各 69,845 字节，SHA-256 `997b078d…`）。
两个文件都在 `</body>` 前追加了返回按钮（与 forecast、wiki 各页同一套右下角样式），
按钮在浅色与深色主题下都自适应：追加块本身不含换行符（1,205 字节），另加一个 CRLF 接回原件。
脱敏再替换 7 个字节后，两个文件各 71,059 字节，SHA-256 `e47bd56f…`，且仍逐字节相同。

页面内嵌一段混淆脚本（20 个反转 base64 串 → `atob` → 与 32 字节密钥数组异或 → FNV-1a 校验 `851106807`），
解开后是 18,046 字符的正常页面逻辑，其中不含任何网络请求、外链或数据外发；
上述 ID 与 QQ 号在解密载荷中零出现，只存在于那段惰性碎片里。

### 文件下载 (downloads)

首页第六个模块，把散落在各目录里的随档文件集中成下载入口。`wiki/v1/` 与 `wiki/v2/` 的
`密码.txt`、`readme.zip` 哈希完全一致，所以只放一份。桌面宽度下是四列两行，见下方网格说明。

| 文件 | 实际位置 | 说明 |
| --- | --- | --- |
| `密码.txt` | `wiki/v1/` | 64 B，解密密码 |
| `readme.zip` | `wiki/v1/` | 508 B，原始加密文件 |
| `local-continuity-probe-0.1.0.jar` | `number-of-motion/files/` | 9.8 KB，本地连续性探针 |
| `CHECKSUMS.txt` | `number-of-motion/files/` | 658 B，探针三个文件的 SHA-256 与使用须知 |
| `god.m4a` | `wiki/v3/` | 3.4 MB，Somniomancer [null set]，调查维基 v3（GOD SAYS）音频 |
| `GDF-ALERT-LEVEL-III.mp3` | `forecast/v2/` | 9.2 MB，脑叶公司三级警报，大黄昏预测 v2 警报音频 |
| `first-stamp.png` | `postal-terminal/` | 2.9 MB，雨前首封，邮路终端首枚邮票 |
| `life-flow.mp3` | `postal-terminal/` | 7.5 MB，邮路终端背景音乐 |

### 杂项 (MISC)

外部入口，汇总在首页第七个模块：

- B站 · XIKM HLQA ONYIEN：`https://space.bilibili.com/3493126603803061`
- 抖音 · VHQ-4K/19：分享主页链接
- 腾讯文档 · XIKM HLQA ONYIEN 解谜：`https://docs.qq.com/doc/DZURVVXJkS1NZWFNq`
- B站 · Silverfish_0：`https://space.bilibili.com/1239867708`
- 迷雾论坛：`https://www.mistarg.cn/`
- QQ 群链接：`https://qm.qq.com/q/EICZzM2KTC`

### GitHub 主页 (github)

首页第八个模块，即末位模块，汇总三个 GitHub 主页：

- `0-silverfish`：作者新主页，邮路终端所在仓库
- `Silverfish-0`：原账号，存档与预测页来源
- `Rosmontis220`：本存档仓库所在账号

这三个链接原先放在页脚，现已独立成模块；页脚只保留标题文字。

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
- `postal-terminal/index.html` - 邮路终端（30 个邮票槽位）
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
