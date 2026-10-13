# 華夏百色圖 · 自动导览交互版

这是一份以 GitHub 原站 `yue-77/chinese-colors-atlas` 为底稿的本地网页。
原站的 48 色数据、D3 图谱、详情、色系与召色功能全部保留，并补充 52
份完整颜色档案，组成 100 色资料库。打开页面后，全屏画布会自动完成一条连续广告导览：

原站同步版本：`main@b9911e8`（2026-06-01）。

`分层高清封面依次显现 → 封面淡出、百色圆点沿波浪形 S 线由远及近并聚合为带图谱连线的四象限双轨色环 → 圆点丝滑展开为四来源横向色卡并各展开两份完整档案 → 八色系名片重排并以整体图谱停留四秒 → 色卡收回百色环并直接进入召色，四组意境各召五色飞入召色框、完整停留五秒后原路回环 → 百色舒展为双环并显现「華夏色譜」片尾标志`

自动导览总时长为 90 秒：

- `0–2.35s` 新版「華夏色譜」封面完整呈现
- `2.35–8s` 封面交叉淡出，百色沿 S 形入场并稳定成环
- `8–12s` 百色环丝滑展开为矿物、草木、典籍、自然四象限
- `12–30s` 四象限各连续展示 2 个完整颜色档案，每色 2.25 秒
- `30–34s` 四来源名片丝滑重排为八色系
- `34–38s` 八色系整体图谱停留，不展开单色档案
- `38–40s` 色系名片收回为中央百色双轨环
- `40–42s` 同一百色环平滑接入召色界面
- `42–85.85s` 江南春雨、敦煌国风、宋瓷禅意、文人书房四组等长召色；每组五张色卡全部落位后停留 5 秒
- `85.85–90s` 百色由召色环舒展为全幅双环，中央显现「華夏色譜」片尾标志

## 百色资料与色号说明

- 原 48 色数据保持不变；新增 52 色位于 `assets/colors-extended.js`。
- 四来源合并后为矿物、草木、典籍、自然各 25 色。
- 主色系保持均衡：赤、黄、绿、蓝各 13 色，紫、素、玄、褐各 12 色。
- 每份档案包含色名、拼音、HEX、来源、年代、溯源、典故、典籍，以及色系、时期、地域、工艺四类图谱关系。
- HEX 是供屏幕设计使用的现代近似值，不代表古代染料、矿物或文物的精确色度测量。资料整理参考[华夏色谱的来源说明](https://chinesecoloratlas.com/zh-Hant/about)、[故宫博物院颜料与器物研究](https://www.dpm.org.cn/journal/256086.html)、[中国丝绸博物馆敦煌染料研究](https://chinasilkmuseum.com/gskt/info_319.aspx?itemid=27750)、[中国传统色现代色值整理](https://noneko.cn/)及条目中所列典籍。

## 启动

```bash
cd "/Users/roi/Desktop/color project 2/chinese-colors-atlas-cinematic"
npm run dev
```

浏览器打开 `http://127.0.0.1:4180`。

- 页面默认自动播放一次，结束后停在完整原站。
- 自动导览使用独立全屏舞台，原站顶部导航与右侧详情栏不会进入录屏。
- 点击“全屏录制”可进入浏览器全屏、自动隐藏控制按钮，并从第 0 秒重新播放。
- `Space` 随时播放 / 暂停；`F` 在不重置进度的情况下切换全屏；`R` 从头重播；输入召色文字时快捷键会自动停用。
- 也可打开 `http://127.0.0.1:4180/?record=1`，直接获得无按钮的录制画面。
- 若要先准备录屏再开始，可打开 `http://127.0.0.1:4180/?record=1&paused=1`，开始录制后按空格播放。
- 国风轻音乐已经内置在页面中，会随画面一起播放、暂停、重播和定位，并在片尾自动淡出；如需静音版，可在地址后增加 `&music=0`。
- “暂停 / 继续”“重播”“全屏录制”“进入图谱”也可直接点击控制导览。
- 点击自动导览中的任一色，可查看完整颜色档案。
- 点击原站导航会立即接管并回到原网站交互。
- 录屏时可使用 `http://127.0.0.1:4180/?record=1` 隐藏播放控件。

## OBS 4K 高清录制

- OBS“浏览器”来源的地址使用 `http://127.0.0.1:4180/?record=1&paused=1`。
- 浏览器来源宽度设为 `3840`、高度设为 `2160`；OBS“设置 → 视频”中的基础画布和输出分辨率也都设为 `3840 × 2160`。
- 不要把浏览器来源设为 1920 后再在 OBS 中放大。录制模式会固定使用 1920 × 1080 的设计画布计算布局，再由浏览器直接以 4K 像素密度绘制文字、色卡与图谱连线。
- 来源放入画布后，右键来源选择“变换 → 适配屏幕”；避免手动拖拽成非整数缩放。
- 画面准备好后开始录制，再在预览页面按一次空格播放；结束后再停止录制。
- OBS 浏览器来源属性中勾选“通过 OBS 控制音频（Control audio via OBS）”，并在“音频混音器”中确认该浏览器来源没有静音。由于浏览器会阻止无操作的自动播放，推荐始终使用带 `paused=1` 的地址，再通过“交互”窗口按一次空格，这次用户操作会同时启动画面和音乐。

## 四源实拍素材

四源场景不再使用生成式插画，现采用 Wikimedia Commons 的真实照片：

- 矿物：Derek Ramsey，[`Azurite Specimen China 1.JPG`](https://commons.wikimedia.org/wiki/File:Azurite_Specimen_China_1.JPG)，CC BY-SA 4.0
- 草木：Dinesh Valke，[`Indigofera tinctoria 256480470.jpg`](https://commons.wikimedia.org/wiki/File:Indigofera_tinctoria_256480470.jpg)，CC BY-SA 4.0
- 自然：颐园居，[`Huangshan mist 20141109.jpg`](https://commons.wikimedia.org/wiki/File:Huangshan_mist_20141109.jpg)，CC BY-SA 4.0
- 典籍：Love&peaceforever，[`Ancient Book with Dragon Scale Binding.png`](https://commons.wikimedia.org/wiki/File:Ancient_Book_with_Dragon_Scale_Binding.png)，CC BY-SA 4.0


Portfolio integration: original font glyphs are preserved in WOFF2 subsets containing every character used by the included HTML, CSS and data. Original font name and license metadata are retained.
