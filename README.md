# SILVERFISH_0 Archive

断联前后的完整记录。

## 结构

```
SILVERFISH_0-Archive/
│
├── index.html          # 主页面（版本选择）
├── README.md           # 说明文档
├── avatar_silverfish.jpg            # 站点头像（首页 logo 与 favicon）
├── call-of-iberia.mp3               # 暗色主题背景音乐
├── CONFRONT.mp3                     # 亮色主题背景音乐
├── Mayors-the-Yearning-Flotsam.mp3  # 黑红主题背景音乐
├── crimson-background.webp          # 黑红主题背景图
│
├── sfx/                # 界面音效（点击 / 翻页 / 进入档案库）
│
├── fonts/              # 首页字体（子集化 woff2，四份）
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
├── postal-terminal/    # 邮路终端（作者换号后发布，两代并存）
│   ├── v1/             # 上游旧历史 b65f684
│   │   ├── index.html  # 30 个邮票槽位，单页应用
│   │   ├── 404.html    # 与 index.html 字节相同
│   │   ├── first-stamp.png # 2.9 MB，雨前首封
│   │   └── life-flow.mp3   # 7.5 MB，背景音乐
│   └── v2/             # 上游当前历史 0df8c37（重制版）
│       ├── index.html  # 身份门 + 2 枚邮票 + AES 加密资源
│       ├── 404.html    # 与 index.html 字节相同
│       ├── r0.bin      # AES-GCM 密文，解出为 first-stamp.png
│       ├── r1.bin      # AES-GCM 密文，解出为第二枚邮票
│       ├── r2.bin      # AES-GCM 密文，解出为 life-flow.mp3
│       ├── night-route-signal.bin # AES-GCM 密文，ID 模式音频
│       ├── return-portrait.bin    # AES-GCM 密文，ID 模式头像
│       ├── starrev-stamp.png      # 解密后的第二枚邮票
│       ├── night-route-signal.m4a # 解密后的音频
│       └── return-portrait.jpg    # 解密后的头像
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
`文件下载` 模块额外挂一个 `.card-grid--clamp2`，把卡片描述限制在 4 行（文件大小 1 行 + 归属模块 1 行 + 文件说明最多 2 行）。

主题切换时背景音乐同步更换，全站共用单个 `<audio id="archive-music">`，只换 `src` 不重建元素：

| 主题 | 曲目 | 大小 |
| --- | --- | --- |
| `dark`（默认） | `call-of-iberia.mp3` | 8.9 MB |
| `light` | `CONFRONT.mp3` | 9.5 MB |
| `crimson`（隐藏，需解锁） | `Mayors-the-Yearning-Flotsam.mp3` | 11.4 MB |

## 字体

首页用四份字体，都放在 `fonts/`，全部是子集化后的 woff2，合计约 411 KB：

| 字体 | 用途 | 文件 | 大小 |
| --- | --- | --- | --- |
| Novecento Wide Bold | **只用在开头 hero 的 `SILVERFISH_0` 与 `ARCHIVE`**（连同同名 boot logo） | `novecento-wide-bold.woff2` | 7 KB |
| Bender | 编号与计数小字：模块编号、`01 / 09`、分页页码、结果计数、卡片底栏 | `bender.woff2` | 9 KB |
| 思源黑体 CN Medium | 全部正文与标签：中文正文、说明、归属行、导航、按钮、卡片 kicker、hero 副标题 | `source-han-sans-cn-medium.woff2` | 172 KB |
| 思源宋体 CN Heavy | 中文标题（真 900）：`series-name` 与 `card-title` | `source-han-serif-cn-heavy.woff2` | 217 KB |

Novecento Wide 是明日方舟的主拉丁字体，Bender 是其基建字体；中文正文与标题分别用思源黑体
Medium 与思源宋体 Heavy。Novecento 刻意只出现在开头，其余拉丁文字一律走思源黑体。

CSS 按角色分了变量：`--display`（Novecento，仅 hero）、`--title`（大小写安全的标题栈）、
`--bender`（编号小字）、`--sans-cn`（正文与标签）、`--mono`（终端等宽，Consolas 开头、中文回落思源黑体）。
四份都写了 `font-display: swap`，并在 `<head>` 里 preload、同时进了 boot 的 `PRELOAD_FILES`。

两个坑：

- **Novecento 是全大写展示字体**，小写输入会被画成大写字形（`readme.zip` 会显示成 `README.ZIP`）。
  所以它不能用在显示文件名或版本号的地方；`card-title` 用 `--title`（思源宋体优先、大小写安全），
  `series-name` 同理，标题的 `v1`/`v2` 才不会被改写成 `V1`。
- 中文只有 500（黑体）与 900（宋体）两个字重，所以**含中文的元素不要把 `font-weight` 设在 600-800**，
  否则浏览器会算法加粗，得到假粗。拉丁侧 Novecento 是真 700、Bender 是真 400，同理不要往上加粗。

子集化按全站文本里的汉字加 ASCII 与常用符号裁剪，原始 19.7 MB 压到 411 KB。文案大幅变动后需要重新生成：

```bash
pip install brotli   # woff2 输出依赖
pyftsubset SourceHanSansCN-Medium.otf --text-file=chars.txt \
  --unicodes=U+0020-007E,U+00A0-00FF,U+2000-206F,U+2190-21FF,U+2200-22FF,U+25A0-25FF,U+2713 \
  --output-file=fonts/source-han-sans-cn-medium.woff2 --flavor=woff2 --no-hinting --desubroutinize
```

其中 `chars.txt` 是把存档里 `*.html`、`*.js`、`*.css`、`*.md` 中出现过的汉字与中文标点去重后
拼成的一行文本。子集只覆盖当前用字，新增生僻字若不在集合内会回落到系统字体。

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

上游于 2026-09-20 强制重写历史，旧提交 `6b1ea71` / `b65f684` 被新提交 `710fb72` / `bad843c` / `0df8c37` 取代。
因此本存档按版本分目录保留两代：`postal-terminal/v1/` 与 `postal-terminal/v2/`。

#### v1（对应上游旧历史 `b65f684`）

单个自包含的 `index.html`（原件 69,351 字节），无外链、无构建步骤，全部逻辑内嵌：

- 30 个邮票槽位，其余保持静默，页面不给任何提示
- 启动进度条：5 秒定时，缓动曲线 `1-(1-t)³`，6 段状态文案
- 背景音乐 `life-flow.mp3`，默认音量 0.52
- **4 位坐标答案 `6825`**，源码里写作十六进制字节数组 `[0x36,0x38,0x32,0x35]`
- 解锁路径：点中央 `30` 圆环 → 进入 `.hunt-mode` → 鼠标当手电筒照出完全透明的坐标门（230px 内平方衰减）→ 输入 4 位坐标
- 进度**不持久化**，刷新即回到 0 / 30（源码里没有任何 storage 调用）

页面内含一段写给某位收件人的 `<template data-postal-fragment>` 碎片，其中有真实 ID（`xinghuan`）与 QQ 号。
这段碎片是惰性的：解密后的页面逻辑从不引用 `template`、`postal-fragment` 或该属性值，
所以它不影响页面任何功能，只是静态文本，**本存档按作者原意保留原文，未脱敏**。

#### v2（对应上游当前历史 `0df8c37`）

重制版，`index.html` 93,938 字节，混淆载荷由 18,788 字节增长到 31,568 字节：

- 混淆同族但参数全换：27 个反转 base64 串，仍为 32 字节密钥，FNV-1a 校验值变为 `3689329001`
- 5 个资源全部改为 **AES-256-GCM** 加密的 `.bin`，浏览器内经 `crypto.subtle` 解密成 blob URL
- 新增**身份门**：访客 / ID 双身份，ID 模式校验载荷内硬编码的 `ALLOWED_ID`
- 新增 **localStorage 持久化**（`prt_identity_v3` / `prt_firstcover_v1` / `prt_starrev_v2`），刷新不再归零
- 邮票由 1 枚变 2 枚：`雨前首封`（ARC-00）与 `星幻_StarRev`（《废墟图书馆》）

v2 资源解密结果（密钥内嵌于载荷，本存档已实测全部解出）：

| 密文 | 明文类型 | 大小 | 说明 |
| --- | --- | --- | --- |
| `r0.bin` | PNG | 3,041,794 B | 与 v1 的 `first-stamp.png` 逐字节相同 |
| `r1.bin` | PNG | 3,047,581 B | 第二枚邮票 `星幻_StarRev` |
| `r2.bin` | MP3 | 7,843,330 B | 与 v1 的 `life-flow.mp3` 逐字节相同 |
| `night-route-signal.bin` | M4A | 3,618,616 B | 夜航邮路信号，ID 模式专属 |
| `return-portrait.bin` | JPEG | 52,643 B | 返程头像，ID 模式专属 |

密文比明文各多 16 字节（GCM 认证标签）。解出的明文副本以规范扩展名另存于 `v2/`
（`starrev-stamp.png`、`night-route-signal.m4a`、`return-portrait.jpg`），便于直接查看与下载。

两代的 `index.html` 与 `404.html` 都在 `</body>` 前追加了返回按钮（与 forecast、wiki 各页同一套右下角样式），
追加块本身不含换行符，另加一个 CRLF 接回原件。`v1` 与 `v2` 各自的两个文件在原件状态下字节完全相同。
去掉返回按钮并归一化行尾后，`v1` 的两个文件与上游 `b65f684` 对应文件**逐字节一致**。

v2 依赖 `crypto.subtle`，只在**安全上下文**（HTTPS 或 localhost）可用；
直接用 `file://` 双击打开会因资源解密失败而空白。GitHub Pages 是 HTTPS，不受影响。

### 文件下载 (downloads)

首页第六个模块，把散落在各目录里的随档文件集中成下载入口。`wiki/v1/` 与 `wiki/v2/` 的
`密码.txt`、`readme.zip` 哈希完全一致，所以只放一份。共 15 个文件，模块上方是分类筛选
（全部 / 文本 / 音频 / 图像 / 压缩包）与关键词搜索，下面按每页 4 个分页；筛选和搜索作用于
全部 15 个文件，分页只对筛选后的结果集切页，翻页时卡片按方向从左右滑入。

每张下载卡片的描述里，「文件大小」那行下方是归属模块行（`.card-source`，等宽小字），再下面是
文件说明。归属标明这份文件来自首页哪个模块，重名文件靠这一行区分；文件在仓库里的具体位置见
下表。模块上方的搜索框会同时匹配文件名、说明文字、预设关键词和归属模块。

`readme.zip` 的解压密码印在它自己的卡片描述里（`.card-pass`：等宽小字、主题强调色、保留大小写、
点一下只选中密码本身），替掉了原来那行「原始加密文件 · v1 与 v2 相同」，不必再去翻 `密码.txt`
或本 README。因为密码是卡片可见文字，搜索 `insight` 也会命中这张卡片。

重名或同内容的对应关系：

| 卡片 | 其他位置 |
| --- | --- |
| `密码.txt` | `wiki/v1/` 与 `wiki/v2/` 各一份且字节相同，卡片只列 v1 |
| `readme.zip` | 同上，卡片只列 v1 |
| `README.md` | `number-of-motion/` 与根目录各一份，卡片指向 `number-of-motion/` |
| `first-stamp.png`、`starrev-stamp.png`、`life-flow.mp3`、`night-route-signal.m4a`、`return-portrait.jpg` | `postal-terminal/v2/` 的 `.bin` 解密后就是这些明文，两者内容一致 |

根目录的 `call-of-iberia.mp3`、`CONFRONT.mp3`、`Mayors-the-Yearning-Flotsam.mp3`、
`crimson-background.webp` 与 `sfx/` 下的音效是首页主题与交互资源，未列入下载模块。

| 文件 | 实际位置 | 说明 |
| --- | --- | --- |
| `密码.txt` | `wiki/v1/` | 64 B，解密密码 |
| `readme.zip` | `wiki/v1/` | 508 B，原始加密文件 |
| `local-continuity-probe-0.1.0.jar` | `number-of-motion/files/` | 9.8 KB，本地连续性探针 |
| `CHECKSUMS.txt` | `number-of-motion/files/` | 658 B，探针三个文件的 SHA-256 与使用须知 |
| `LOCAL_COPY.txt` | `number-of-motion/files/` | 4.6 KB，本地副本内嵌文件（关于「锚」的几次改口） |
| `README.md` | `number-of-motion/` | 452 B，运动之数发布方随附说明 |
| `god.m4a` | `wiki/v3/` | 3.4 MB，Somniomancer [null set]，调查维基 v3（GOD SAYS）音频 |
| `background.png` | `wiki/v3/` | 2.5 MB，调查维基 v3（GOD SAYS）背景图 |
| `GDF-ALERT-LEVEL-III.mp3` | `forecast/v2/` | 9.2 MB，脑叶公司三级警报，大黄昏预测 v2 警报音频 |
| `first-stamp.png` | `postal-terminal/v1/` | 2.9 MB，雨前首封，邮路终端 v1 首枚邮票 |
| `life-flow.mp3` | `postal-terminal/v1/` | 7.5 MB，邮路终端 v1 背景音乐 |
| `starrev-stamp.png` | `postal-terminal/v2/` | 2.9 MB，星幻_StarRev，邮路终端 v2 第二枚邮票 |
| `night-route-signal.m4a` | `postal-terminal/v2/` | 3.5 MB，夜航邮路信号，ID 模式专属 |
| `return-portrait.jpg` | `postal-terminal/v2/` | 51 KB，返程头像，ID 模式专属 |
| `avatar_silverfish.jpg` | 根目录 | 9.3 KB，站点头像与图标原图 |

`LOCAL_COPY.txt` 原本只以 ZIP 形式内嵌在 `number-of-motion/files/local-copy.html` 里（该页是加密的
单文件页，正文中段就是一段原始 ZIP 字节），下载模块里这份是按原字节解出的单独副本：4,695 B、
LF 换行、无 BOM，SHA-256 `cc1fe65549b900f46fefa75c47481720114eb8460761e3884dc3757bc59def76`。
解出时与原文件逐字节一致，归属标为「运动之数 · 本地副本」。`local-copy.html` 本身没有被改动。

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

解压密码：`INSIGHTFUTURETHROUGHTHEFOG`（首页下载模块里已印在这张卡片的描述中）

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
