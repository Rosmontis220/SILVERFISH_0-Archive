# SILVERFISH_0 Archive

断联前后的完整记录。

## 结构

当前仓库把原版网页与附加资源分开管理：`archive/` 保存原版网页和它们的原始依赖；`resources/` 保存首页素材、解密副本、公共脚本、字体、音效和汉化页面。首页通过 `viewer.html` 打开存档网页，并在外壳中注入统一返回入口与邮路控制台，因此 `archive/` 下的网页本身不包含本存档追加的按钮或脚本。首页脚本已拆到 `resources/scripts/`，首页与控制台共用 `resources/sfx/legacy/` 中的本地音效。

```text
SILVERFISH_0-Archive/
├── index.html                         # 首页
├── viewer.html                        # 原版网页全屏浏览外壳
├── CNAME
├── README.md
├── archive/                           # 原版网页与原始依赖
│   ├── wiki/{v1,v2,v3}/
│   ├── forecast/{v1,v2}/
│   ├── number-of-motion/files/
│   └── postal-terminal/{v1,v2,v3,v4,v5}/
└── resources/                         # 本存档附加资源
    ├── music/                         # 首页与控制台使用的音乐
    ├── sfx/                           # UI 音效及 sources.json
    ├── images/                        # 首页与解密副本图片
    ├── scripts/                       # viewer、返回入口、音效、控制台
    ├── fonts/                         # 首页字体
    └── localized/                     # 汉化网页
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

## 界面音效

首页和邮路控制台使用 `resources/sfx/legacy/` 中保留的五段历史本地音效。映射和原始提交来源记录在 [`resources/sfx/sources.json`](resources/sfx/sources.json)；PCS 页面曾被检查过，但其当前音效不参与播放。

## 字体

首页用四份字体，都放在 `resources/fonts/`，全部是子集化后的 woff2，合计约 411 KB：

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

原版页面不包含本存档追加的返回按钮。通过首页卡片打开时，`viewer.html` 会在同源 iframe 中注入右下角「返回存档索引」入口；直接访问 `archive/` 下的原件则保持原版内容。

### 汉化 (localized)

把原本全英文的两份大黄昏预测页面翻译成中文，原版页面保持不动：

- `resources/localized/forecast-v1/`：预测页中文版（版式、配色与交互与原版一致）
- `resources/localized/forecast-v2/`：事件页中文版，仍为加密壳，解密后为中文内容；保留手动警报门禁，音频引用原版 `archive/forecast/v2/GDF-ALERT-LEVEL-III.mp3`

### 运动之数 (number-of-motion)

来自仓库 `https://github.com/Silverfish-0/number-of-motion`，以及 2026-09-10 的 B 站动态《失联以后，这边还在走》。
这是一个 Minecraft 侧的小模组谜题，不是网页存档，因此单独成一个模块：

- `archive/number-of-motion/files/local-continuity-probe-0.1.0.jar`：Local Continuity Probe／本地连续性探针 v0.1.0，环境 Minecraft Java 1.20.1 + Forge 47.4.10
- `archive/number-of-motion/files/last-local-record.html`：本地记录，加密外壳，需在浏览器内输入密钥解封
- `archive/number-of-motion/files/local-copy.html`：本地副本，同为加密外壳
- `archive/number-of-motion/files/CHECKSUMS.txt`：发布方自述的注意事项与三个文件的 SHA-256

三个文件按发布时的原始字节保存，未做任何改动，SHA-256 与 `CHECKSUMS.txt` 完全一致。
首页只收录两份记录网页，模组与说明按原样留在目录里，不进入首页模块。

两份记录网页以发布方原始字节保存；返回入口由 `viewer.html` 运行时注入，不写入页面文件。`CHECKSUMS.txt` 中的原件 SHA-256 可直接对照 `archive/number-of-motion/files/` 下对应文件。

| 文件 | 原件 SHA-256 |
| --- | --- |
| `archive/number-of-motion/files/last-local-record.html` | `d525670114f1f084c36bcf60daad13b29293c099f3a06ad6f757d8ebe501c09f` |
| `archive/number-of-motion/files/local-copy.html` | `866d44866e9d30836bc75869b423fa7fa95c72af084b844521e1d7db938d7c3f` |

发布方在说明里要求：不要上传到所谓在线解密站，也不要把这件事扩展成对任何现实人物的调查；模组不联网、不上传数据。

#### 解封密钥与来源

`last-local-record.html` 的解封密钥是 `20260810`。

来源是 2026 年 8 月 10 日《泰拉瑞亚》大型模组「灾厄」(Calamity Mod) 宣布全面停止开发与更新的公告日。
发布动态里那段话就是提示：「还有一个沙盒游戏，世界是在一张纸上的。那边有个叫大型模组，做了十年。后来它停更了。悼念。」
——一张纸上的沙盒游戏指 2D 横版世界的泰拉瑞亚，做了十年后停更的大型模组指灾厄。

### 邮路终端 (postal-terminal)

来自仓库 `https://github.com/0-silverfish/postal-terminal`，作者称原账号 `Silverfish-0` 遭攻击后换号，新号即 `0-silverfish`。

上游于 2026-09-20 强制重写历史，旧提交 `6b1ea71` / `b65f684` 被新提交 `710fb72` / `bad843c` / `0df8c37` 取代；
2026-09-25 追加提交 `8559e6f`（`Add files via upload`），页面与资源大幅扩容；
2026-09-26 再更新 `976cdaa`（`update`），新增第四枚邮票「未署名附件」与一个加密资源。
因此本存档按版本分目录保留五代：`archive/postal-terminal/v1/`、`archive/postal-terminal/v2/`、`archive/postal-terminal/v3/`、`archive/postal-terminal/v4/` 与 `archive/postal-terminal/v5/`。

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

`index.html` 与 `404.html` 均以原版内容保存；通过 `viewer.html` 打开时才会运行时注入返回入口和控制台。`v1` 与 `v2` 各自的两个文件内容一致，`v3`、`v4` 保留上游页面与各自独立的加密资源。

v2 依赖 `crypto.subtle`，只在**安全上下文**（HTTPS 或 localhost）可用；
直接用 `file://` 双击打开会因资源解密失败而空白。GitHub Pages 是 HTTPS，不受影响。

#### v3（对应上游 `8559e6f`）

第三版，`index.html` 由 93,938 字节扩到 **161,500 字节**，是最接近「新作」的一版：

- 混淆同族、密钥照旧（32 字节数组 `[65,17,232,…]` 仍各自异或 167），
  但载荷由 31,568 字节涨到 **51,767 字节**（明文 JS 50,247 字符），
  FNV-1a 校验值变为 `2415988254`；分片方式由 27×1600 改为 54×1282
- 素材表由 5 项扩到 **9 项**，仍是 AES-256-GCM，AAD 依旧是 `postal-route:a`…`postal-route:i`
- 身份门由两档扩到 **三档**：游客 / 管理员（`星幻_StarRev`）/ 邮递员（显示 `无访问权限 / ACCESS DENIED`），
  `LOGIN_KEY` 升为 `prt_identity_v3`
- 新增**常驻信号选择**：除默认的「夜航邮路信号」外，可选 `CONFRONT` 与 `Iron Lotus`
- 邮票由 2 枚变 **3 枚**：新增 `未寄之门 / THE UNPOSTED GATE`（`ROUTE ZERO / ACTIVATION TRACE`）
- 页面末尾的 `<template data-postal-fragment="xinghuan">` 碎片由上游原作者自己保留，
  本存档照原样收入；v3 的页面本身就带这段，不是本存档追加的
- 行尾由上两代的 CRLF 改为 **LF**，所以本存档给 v3 追加返回按钮时接的是一个 LF

v3 资源解密结果（密钥内嵌于载荷，本存档已实测全部解出）：

| 密文 | 明文类型 | 大小 | 说明 |
| --- | --- | --- | --- |
| `r0.bin` | PNG | 3,041,794 B | 与 v1/v2 相同（`first-stamp.png`） |
| `r1.bin` | PNG | 3,047,581 B | 与 v2 相同（`starrev-stamp.png`） |
| `r2.bin` | MP3 | 7,843,330 B | 与 v1/v2 相同（`life-flow.mp3`） |
| `night-route-signal.bin` | M4A | 3,618,616 B | 与 v2 相同 |
| `return-portrait.bin` | JPEG | 52,643 B | 与 v2 相同 |
| `unposted-gate.bin` | PNG | 3,215,158 B | 第三枚邮票，1536×1024 |
| `route-echo-cinder.bin` | M4A | 4,091,422 B | 信号 `CONFRONT` |
| `route-echo-lotus.bin` | M4A | 3,874,105 B | 信号 `Iron Lotus` |
| `courier-record.bin` | JPEG | 20,322 B | 邮递员头像（`profileCourierAvatar`） |

前五个密文与 v2 目录里的同名文件经 `git hash-object` 比对**完全一致**，属沿用而非重发；
因此 v3 目录只额外保留这四个新资源解密后的明文，v1/v2 已收入的明文不再重复。
`unposted-gate.png`、`route-echo-cinder.m4a`、`route-echo-lotus.m4a` 与 `courier-record.jpg`
已加入下载模块，下载文件数由 15 增至 19。

#### v4（对应上游 `976cdaa`）

第四版，是 v3 的直接续作（身份门、坐标、`prt_identity_v3` 等沿用），`index.html` 由 161,500 字节扩到 **184,496 字节**：

- 混淆结构不变（62 个反转 base64 串、32 字节密钥），载荷由 51,767 字节涨到约 57,000 字节，
  FNV-1a 校验值变为 `1268373371`
- 素材表由 9 项扩到 **10 项**（`postal-route:a`…`postal-route:j`），新增 `unattributed-attachment.bin`
- 邮票由 3 枚变 **4 枚**：新增 `未署名附件 / The Unattributed Attachment`
  （`POSTAL STAMP / FOURTH ISSUE`，第四槽位需输入附件序列号解锁，且带提示）；存储键新增 `prt_unattributed_attachment_v1`
- 本次上游提交只改了两个页面并新增这一个加密附件，**没有改动任何旧 `.bin`**

v4 资源解密（v4 目录 `index.html` 载荷内嵌密钥，本存档已实测解出全部 10 项）：

| 密文 | 明文类型 | 大小 | 说明 |
| --- | --- | --- | --- |
| `r0.bin` | PNG | 3,041,794 B | 与 v1/v2 相同（`first-stamp.png`） |
| `r1.bin` | PNG | 3,047,581 B | 与 v2 相同（`starrev-stamp.png`） |
| `r2.bin` | MP3 | 7,843,330 B | 与 v1/v2 相同（`life-flow.mp3`） |
| `night-route-signal.bin` | M4A | 3,618,616 B | 与 v2 相同 |
| `return-portrait.bin` | JPEG | 52,643 B | 与 v2 相同 |
| `unposted-gate.bin` | PNG | 3,215,158 B | 第三枚邮票 |
| `route-echo-cinder.bin` | M4A | 4,091,422 B | 信号 `CONFRONT` |
| `route-echo-lotus.bin` | M4A | 3,874,105 B | 信号 `Iron Lotus` |
| `courier-record.bin` | JPEG | 20,322 B | 邮递员头像 |
| `unattributed-attachment.bin` | PNG | 3,045,736 B | 第四枚邮票 `未署名附件` |

前九项与 v3 目录里的同名 `.bin` 逐字节一致。v4 目录额外保留新资源解出的明文 `unattributed-attachment.png`，
已加入下载模块（下载文件数由 20 增至 21）。返回入口统一由 `viewer.html` 运行时注入。

#### v5（对应上游 `80cb3ef`）

第五版沿用 v4 的前十项加密资源，并新增 `joint-disposition.bin`，页面与资源已原样保存于 `archive/postal-terminal/v5/`。新增第五枚邮票「首席代理代表 / CHIEF DELEGATE」，使用存储键 `prt_chief_delegate_v1`。解锁入口位于完整终端的「联合处置」文件导入，控制台会自动生成符合原页面文件名校验的 `联合处置决议.txt` 并触发原页面流程。

### 文件下载 (downloads)

首页第六个模块，把散落在各目录里的随档文件集中成下载入口。`archive/wiki/v1/` 与 `archive/wiki/v2/` 的
`密码.txt`、`readme.zip` 哈希完全一致，所以只放一份。共 21 个文件，模块上方是分类筛选
（全部 / 文本 / 音频 / 图像 / 压缩包）与关键词搜索，下面按每页 4 个分页；筛选和搜索作用于
全部 21 个文件，分页只对筛选后的结果集切页，翻页时卡片按方向从左右滑入。

每张下载卡片的描述里，「文件大小」那行下方是归属模块行（`.card-source`，等宽小字），再下面是
文件说明。归属标明这份文件来自首页哪个模块，重名文件靠这一行区分；文件在仓库里的具体位置见
下表。模块上方的搜索框会同时匹配文件名、说明文字、预设关键词和归属模块。

`readme.zip` 的解压密码印在它自己的卡片描述里（`.card-pass`：等宽小字、主题强调色、保留大小写、
点一下只选中密码本身），替掉了原来那行「原始加密文件 · v1 与 v2 相同」，不必再去翻 `密码.txt`
或本 README。因为密码是卡片可见文字，搜索 `insight` 也会命中这张卡片。

重名或同内容的对应关系：

| 卡片 | 其他位置 |
| --- | --- |
| `密码.txt` | `archive/wiki/v1/` 与 `archive/wiki/v2/` 各一份且字节相同，卡片只列 v1 |
| `readme.zip` | 同上，卡片只列 v1 |
| `README.md` | `archive/number-of-motion/` 与根目录各一份，卡片指向 `archive/number-of-motion/` |
| `first-stamp.png`、`starrev-stamp.png`、`life-flow.mp3`、`night-route-signal.m4a`、`return-portrait.jpg` | `archive/postal-terminal/v2/` 的 `.bin` 解密后就是这些明文，两者内容一致 |

`resources/music/` 下的 `call-of-iberia.mp3`、`CONFRONT.mp3`、`Mayors-the-Yearning-Flotsam.mp3`、
`resources/images/crimson-background.webp` 与 `resources/sfx/legacy/` 下的界面音效是首页主题与交互资源，未列入下载模块。

| 文件 | 实际位置 | 说明 |
| --- | --- | --- |
| `密码.txt` | `archive/wiki/v1/` | 64 B，解密密码 |
| `readme.zip` | `archive/wiki/v1/` | 508 B，原始加密文件 |
| `local-continuity-probe-0.1.0.jar` | `archive/number-of-motion/files/` | 9.8 KB，本地连续性探针 |
| `CHECKSUMS.txt` | `archive/number-of-motion/files/` | 658 B，探针三个文件的 SHA-256 与使用须知 |
| `LOCAL_COPY.txt` | `archive/number-of-motion/files/` | 4.6 KB，本地副本内嵌文件（关于「锚」的几次改口） |
| `README.md` | `archive/number-of-motion/` | 452 B，运动之数发布方随附说明 |
| `god.m4a` | `archive/wiki/v3/` | 3.4 MB，Somniomancer [null set]，调查维基 v3（GOD SAYS）音频 |
| `background.png` | `archive/wiki/v3/` | 2.5 MB，调查维基 v3（GOD SAYS）背景图 |
| `GDF-ALERT-LEVEL-III.mp3` | `archive/forecast/v2/` | 9.2 MB，脑叶公司三级警报，大黄昏预测 v2 警报音频 |
| `first-stamp.png` | `archive/postal-terminal/v1/` | 2.9 MB，雨前首封，邮路终端 v1 首枚邮票 |
| `life-flow.mp3` | `archive/postal-terminal/v1/` | 7.5 MB，邮路终端 v1 背景音乐 |
| `starrev-stamp.png` | `archive/postal-terminal/v2/` | 2.9 MB，星幻_StarRev，邮路终端 v2 第二枚邮票 |
| `night-route-signal.m4a` | `archive/postal-terminal/v2/` | 3.5 MB，夜航邮路信号，ID 模式专属 |
| `return-portrait.jpg` | `archive/postal-terminal/v2/` | 51 KB，返程头像，ID 模式专属 |
| `unposted-gate.png` | `archive/postal-terminal/v3/` | 3.1 MB，未寄之门，邮路终端 v3 第三枚邮票 |
| `route-echo-cinder.m4a` | `archive/postal-terminal/v3/` | 3.9 MB，常驻信号 `CONFRONT` |
| `route-echo-lotus.m4a` | `archive/postal-terminal/v3/` | 3.7 MB，常驻信号 `Iron Lotus` |
| `courier-record.jpg` | `archive/postal-terminal/v3/` | 20 KB，邮递员头像 |
| `unattributed-attachment.png` | `archive/postal-terminal/v4/` | 3.0 MB，未署名附件，邮路终端 v4 第四枚邮票 |
| `joint-disposition.bin` | `archive/postal-terminal/v5/` | 2.0 MB，联合处置决议原始加密材料，邮路终端 v5 第五枚邮票 |
| `avatar_silverfish.jpg` | 根目录 | 9.3 KB，站点头像与图标原图 |

`LOCAL_COPY.txt` 原本只以 ZIP 形式内嵌在 `archive/number-of-motion/files/local-copy.html` 里（该页是加密的
单文件页，正文中段就是一段原始 ZIP 字节），下载模块里这份是按原字节解出的单独副本：4,695 B、
LF 换行、无 BOM，SHA-256 `cc1fe65549b900f46fefa75c47481720114eb8460761e3884dc3757bc59def76`。
解出时与原文件逐字节一致，归属标为「运动之数 · 本地副本」。`local-copy.html` 本身没有被改动。

### 杂项 (MISC)

外部入口，汇总在首页第七个模块：

- B站 · XIKM HLQA ONYIEN：`https://space.bilibili.com/3493126603803061`
- 抖音 · VHQ-4K/19：分享主页链接
- 腾讯文档 · XIKM HLQA ONYIEN 解谜：`https://docs.qq.com/doc/DZURVVXJkS1NZWFNq`
- 腾讯文档 · 邮路终端解谜：`https://docs.qq.com/sheet/DVWpFakpIVmFSZkV1`
- B站 · Silverfish_0：`https://space.bilibili.com/1239867708`
- 迷雾论坛：`https://www.mistarg.cn/`
- QQ 群链接：`https://qm.qq.com/q/EICZzM2KTC`

### GitHub 主页 (github)

首页第八个模块，即末位模块，汇总三个 GitHub 主页：

- `0-silverfish`：作者新主页，邮路终端所在仓库
- `Silverfish-0`：原账号，存档与预测页来源
- `Rosmontis220`：本存档仓库所在账号

这三个链接原先放在页脚，现已独立成模块；页脚只保留标题文字。

## 留档文件（在 archive/wiki/v1/ 和 archive/wiki/v2/ 中）

### 密码.txt
解密密码：`INSIGHTFUTURETHROUGHTHEFOG`

### readme.zip
原始加密文件，包含"巨爆大黄昏预言"的计划代号

解压密码：`INSIGHTFUTURETHROUGHTHEFOG`（首页下载模块里已印在这张卡片的描述中）

## 使用方法

### 本地浏览
直接打开 `index.html`，点击对应版本；网页卡片会进入 `viewer.html`，由外壳挂载返回入口和 v1–v5 邮路控制台。首页邮路卡片输入 `5` 即可打开 v5。

### 独立访问
- `viewer.html?path=archive%2Fwiki%2Fv1%2Findex.html` - 20篇原始版本
- `viewer.html?path=archive%2Fwiki%2Fv2%2Findex.html` - 21篇更新版本
- `viewer.html?path=archive%2Fwiki%2Fv3%2Findex.html` - GOD SAYS
- `viewer.html?path=archive%2Fforecast%2Fv1%2Findex.html` - 大黄昏预测第一版
- `viewer.html?path=archive%2Fforecast%2Fv2%2Findex.html` - 大黄昏预测第二版（加密页，需 WebCrypto 自动解密）
- `viewer.html?path=archive%2Fnumber-of-motion%2Ffiles%2Flast-local-record.html` - 本地记录（加密）
- `viewer.html?path=archive%2Fnumber-of-motion%2Ffiles%2Flocal-copy.html` - 本地副本
- `archive/number-of-motion/files/local-continuity-probe-0.1.0.jar` - 本地连续性探针模组下载
- `viewer.html?path=archive%2Fpostal-terminal%2Fv5%2Findex.html` - 邮路终端 v5（v1–v4 同理）
- `viewer.html?path=resources%2Flocalized%2Fforecast-v1%2Findex.html` - 大黄昏预测第一版汉化
- `viewer.html?path=resources%2Flocalized%2Fforecast-v2%2Findex.html` - 大黄昏预测第二版汉化

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
