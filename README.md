# 《关系回响》宣传视频

## 交付文件

- `out/final/relationship-echo-promo-bgm-final.mp4`：含原创氛围音乐与界面音效。
- `out/final/relationship-echo-promo-no-bgm.mp4`：无背景音乐，保留全部界面音效。
- `out/final/preview.html`：本地双版本预览页。
- `out/final/encoded-contact-sheet.png`：从编码成片每 1 秒抽一帧的联系表。

规格：1920×1080、30 fps、40 秒、H.264 + AAC。

## 产品叙事

1. 品牌开场：把沉默时间，变成关系节律。
2. 30 天关系节律仪：从真实页面进入“为什么今天想起”。
3. 联系人关系卡：上次聊到、关系频率、下次想起。
4. 字卡：不是催促，是重新想起。
5. 搜索与记录问候：真实筛选状态 + 明确“不自动发送”。
6. 双独立坐标：联系频率与维系意愿分开表达。
7. 自定义标签：把关系语境放回联系人身边。
8. 字卡：看见节律，也保留边界。
9. 隐私模式前后对比：相同机位下真实页面切换为匿名状态。
10. UI 变品牌：以本机优先、解释提醒、决定始终在你收束。

## 数据与素材口径

- 未读取、未截图当前 1203 位联系人的内部数据库。
- 页面素材来自端口 `4197` 的全新临时 SQLite 目录；数据由产品内置的合成演示联系人生成。
- 所有实拍截图保留“演示数据”标识；隐私镜头使用产品真实隐私模式，姓名和消息被匿名化。
- 成片不含迁移密码、changeId、数据库物理路径、内部令牌或外部客户信息。
- 页面截图为 1920×1080、deviceScaleFactor 2；整页纹理高度 2941 CSS px。
- BGM 与 SFX 均为项目内程序化原创音频，不依赖第三方版权素材。

## 采用的 Shotcraft 镜头语法

- `brand-ink-open`
- `wipe-transitions · clock-wipe`
- `gauge-readout-moves · needle-sweep-selftest`
- `spotlight-hero-card`
- `paper-title-card`
- `type-and-filter`
- `segmented-thumb-hero`
- `hashtag-to-pill-materialize`
- `before-after-slider-scrub`
- `ui-to-brand-morph · icon-flip-bloom`

具体映射、时值、风险和品牌 token 见 `design-spec.md`。

## 验证记录

- TypeScript：`npx tsc --noEmit` 通过。
- 两版视频均为 1920×1080 / 30 fps / 40 秒，并含 48 kHz 双声道 AAC。
- 两版 H.264 解码视频流 MD5 均为 `828ee8e3d3e711bb33a9e2044a7ea5cb`，确认画面逐帧一致。
- 含音乐版音轨检测：mean `-32.5 dB`，max `-20.7 dB`，综合响度 `-30.6 LUFS`，无削波。
- 无音乐版保留离散动作音效：mean `-47.3 dB`，max `-23.9 dB`。
- 十个镜头均已渲染关键帧并生成编码后 contact sheet；未检出黑场。

含音乐最终版使用已验证的无 BGM 画面/音效母版作为基础，只混入原创音乐床；视频流直接复制，因此两版视觉严格一致。

## 复现

```bash
npm install --no-audit --no-fund
npm run capture
npm run render:bgm
```

`render:bgm` 会先生成无 BGM 的视觉/音效母版，再以视频流复制方式混入音乐，保证两个交付版本的画面逐帧一致。若母版已存在，可单独运行 `npm run mix:bgm`。

页面捕获前必须让 `PROMO_SITE_URL` 指向隔离的虚构数据实例；禁止指向内部数据库预览。
