# UI Lab — 上游组件样式复现实验

实验性项目：基于从上游官方包提取的 **421 个设计令牌**（`src/tokens.css`，
由 `scripts/gen-tokens.mjs` 从 `../upstream-ui/readable/css/` 解析生成），
用 React 19 手写复现聊天应用的核心组件样式。**仅用于个人学习研究**，
不复刻上游代码，组件均为按令牌规范重新实现。

## 运行

```bash
npm install        # 首次（需要网络）
npm run dev        # http://127.0.0.1:5179
npm run dev:fresh  # 缓存异常时用（vite --force 强制重建预构建缓存）
npm run build      # 产物到 dist/（含 sourcemap）
npm run gen:tokens # 上游 CSS 更新后重新生成 tokens.css
```

### Vite 配置要点（`vite.config.js`）

- `resolve.alias`：`@/` 指向 `src/`
- `css.devSourcemap` + `build.sourcemap`：DevTools 里可直接对照源码行（研究友好）
- `server.strictPort`：端口被占直接报错，避免误开第二个实例看错页面
- `server.watch.ignored`：忽略 `../upstream-ui/` 解包产物（几十万文件，防 inotify 耗尽）
- 改了代码页面没更新？先 `npm run dev:fresh`，再不行 `rm -rf node_modules/.vite`

## 页面

- **首页**：组件卡片选择页
- **详情页**：舞台预览 + "观察要点"（该组件用到的令牌与样式规律）
- 右上角可随时切换 明/暗 主题（`data-theme` 属性，令牌全部自动翻转）

## 已复现组件

| 组件 | 复现要点 |
|---|---|
| Buttons | primary/secondary/tertiary/danger；hover 用 `color-mix(前景色 x%, transparent)` 而非固定灰 |
| Composer | 28px 大圆角容器、聚焦边框加深、实心圆形发送钮 |
| Messages | 用户右对齐灰底气泡；助手无气泡 + 16px 小图标操作行 |
| Sidebar | 比主区深半档的背景、8px 圆角列表项、透明混合 hover |
| Model Pill | 胶囊按钮 + elevated 下拉面板（16px 圆角、大阴影、双行菜单项） |
| Tooltip | 反色 12px 小胶囊 |
| Shimmer | `background-clip: text` + 渐变扫过的"思考中"微光 |
| Code Block | `--gray-50` 表面 + 语言栏/复制钮；语法色直接取调色板 token |
| Dialog + Toggle | 遮罩 `color-mix(黑 45%)`、16px 圆角面板；38×22 开关 |
| Toast | 反色胶囊（与 Tooltip 同一套反色语言） |
| Account Menu | 渐变头像 + 状态角标；危险项用错误色文字而非红底 |
| Streaming | 块状光标 steps(2) 闪烁；骨架屏复刻 steps(48) 2.6s 扫光 |
| Sources | 10px 上标引用 pill + favicon 方块/两行截断的来源卡 |
| **Chat Page（收官）** | 侧边栏+顶栏+消息流+输入框整页拼装，零新增颜色 |
| Mode Toggle | 滑块指示器 0.5px 边 + 投影（上游同款参数） |
| Terminal | 背景映射表面令牌（亮主题真·浅色终端），ANSI 色取令牌 |
| Diff Card | 增删行 color-mix 10% 着色 + gutter ± 标记 |
| Form Controls | 滑杆复刻上游 24px 轨道/白色拇指；选中态走主按钮色 |
| Emoji Picker | 上游给 emoji-picker-react 换肤的令牌映射法 |
| Date Picker | 弹层三件套：elevated 底 + hairline 边 + 复合投影 |
| Worktree Dropdown | 分支图标胶囊 + 双行环境项 +「新建…」收尾 |
| Editor Tabs | 未保存橙点替代关闭钮；高亮行 blue-400 内描边 |
| Browser Preview | chrome 分层 + URL 无边框胶囊 + 28px 导航钮 |
| **工作区链路（9 个）** | 选择页 / 目录弹窗 / 文件树 / 项目芯片 / Worktree 设置 / 警告空态 / 引导横幅 / 右键菜单 / 空间切换 |
| └ 设计亮点 | 虚线框=待填充、危险动作 hover 才红、渐变图标仅用于引导焦点、空间方头像 vs 用户圆头像 |

## 已发现的上游问题（研究副产品）

暗色主题下主 bundle 把 `--app-color-background-button-primary` 和
`--app-color-text-button-primary` 同时解析为 `--gray-fixed-1000`（#0d0d0d，
即"黑底黑字"）——与实际渲染（浅色圆钮 + 深色图标）不符，说明发送按钮
实际由 Tailwind `dark:` 类覆盖而非该令牌。本实验在 `app.css` 中用一段
带注释的 `[data-theme="dark"]` 覆盖修正为观察到的真实效果。

## 关键设计规律（从令牌中学到的）

1. **不设死色值**：交互态颜色 = `color-mix(in oklab, 前景色 5~24%, transparent)`，明暗主题自动协调
2. **灰阶翻转**：`--gray-N` 在暗主题下整列反转（gray-0 亮主题 `#fff` ↔ 暗主题 `#0d0d0d`），组件写 `var(--gray-100)` 即可双主题适配
3. **层级靠透明叠加**：elevated 背景是 `color-mix(白色 70%/96%, transparent)` 叠出来的，而非独立色板

## 目录

```
src/tokens.css        生成的设计令牌（light/dark 两组具体值）
src/icons.jsx         手绘 24px 描边图标
src/components/       复现的组件（Buttons/Messages/Sidebar/Misc）
src/App.jsx           组件注册表 + 首页/详情页/主题切换
scripts/gen-tokens.mjs  令牌解析器（lightningcss 嵌套 var() → 具体值）
```
