# 上游 UI 研究 —— 方法、产物与进一步复现指南

本目录是对上游 ChatGPT Linux 桌面应用（Electron）UI 设计的**个人学习研究**，
包含两部分：

| 目录 | 内容 |
|---|---|
| `upstream-ui/` | 官方包的验证下载、解包产物（本地生成，不入库）、设计令牌提取 |
| `ui-lab/` | 用 React 19 + 提取的设计令牌**手写复现**的组件示例库 |

> ⚠️ 上游代码与资源版权归 OpenAI 所有。本研究遵循的原则：
> 不解包产物入库、不复制上游代码；`ui-lab` 中的组件全部是按令牌
> 规范**重新实现**的。色值、间距等事实性数据不受版权保护，但请避免
> 将上游 minified 代码的任何片段直接搬进自己的项目。

## 一、环境重建（克隆本分支后）

被 `.gitignore` 排除的产物全部可以本地重新生成：

```bash
# 1. 下载并验证官方包（信任链：固定 GPG 密钥 → InRelease → Packages → SHA-256）
cd research/upstream-ui
export GNUPGHOME="$PWD/.gnupg" && mkdir -p "$GNUPGHOME" && chmod 700 "$GNUPGHOME"
node ../../scripts/lib/upstream-linux-package.js \
  --output-dir deb --metadata upstream-metadata.json \
  --key-base64 ../../assets/openai-codex-linux-repository-key.gpg.base64 \
  --arch amd64

# 2. 解包 deb → asar
dpkg-deb -x deb/chatgpt_*.deb extracted/
export npm_config_cache="$PWD/.npm-cache"
npx --yes @electron/asar extract extracted/usr/lib/chatgpt/resources/app.asar asar/app

# 3. 美化主 CSS（生成 readable/css/，供令牌提取器消费）
mkdir -p readable/css
for f in asar/app/webview/assets/app-*.css; do
  npx --yes prettier --write "$f" && cp "$f" readable/css/
done

# 4. 重新生成 ui-lab 的 tokens.css
cd ../ui-lab
npm install
npm run gen:tokens
npm run dev   # http://127.0.0.1:5179
```

注意：`.gnupg` 与 `.npm-cache` 放在 workspace 内是为了避开对
`$HOME` 的写入依赖（沙箱环境友好）。

## 二、进一步复现其他组件的方法论

复现一个新组件遵循固定的四步流程：

### 第 1 步：定位 —— 在上游产物中找到目标组件

```bash
# chunk 文件名是语义化的，按组件名关键词搜
ls research/upstream-ui/asar/app/webview/assets/ | grep -i <keyword>

# 例：研究代码块
ls research/upstream-ui/asar/app/webview/assets/ | grep -i code-block
# → chatgpt-code-block-a44c30b43d60.css / *.js
```

每个组件通常有一个独立 CSS chunk（如 `chatgpt-code-block-*.css`），
219 个 CSS 文件名本身就是一张组件清单：

```bash
ls research/upstream-ui/asar/app/webview/assets/*.css | sed 's/-[0-9a-f]*\.css//' | sort -u
```

### 第 2 步：提取 —— 拿到该组件用到的令牌与数值

```bash
# 美化该组件的 CSS 直接阅读
npx prettier research/upstream-ui/asar/app/webview/assets/chatgpt-code-block-*.css

# 在其中找 var(--xxx) 引用，再回 tokens.css 查具体值
grep -oE '\-\-[a-z0-9-]+' <美化后的css> | sort -u
grep '你找到的token名' research/ui-lab/src/tokens.css
```

如果 tokens.css 里没有该令牌（生成器只收录了 gray/blue/app-color/font
等前缀），可以放宽 `scripts/gen-tokens.mjs` 里的 `interesting` 正则后
重新 `npm run gen:tokens`。

### 第 3 步：观察 —— 运行时验证静态结论

静态 CSS 看不出交互态，用 DevTools 实测：

```bash
/opt/codex-desktop/ChatGPT --remote-debugging-port=9222
# 浏览器打开 http://127.0.0.1:9222 → Elements/Styles 面板
```

重点记录：默认/hover/active/focus 四态、明暗主题差异、圆角/间距/字号、
动效时长与缓动。把结论写成"观察要点"（就是 ui-lab 详情页的 notes）。

### 第 4 步：复现 —— 在 ui-lab 中重新实现

1. 在 `src/components/` 新建组件文件（只写结构，样式进 `app.css`）
2. 样式**只引用令牌变量**（`var(--app-color-*)` / `var(--gray-*)`），
   不写死色值——这样才能免费获得明暗双主题
3. 在 `src/App.jsx` 的 `registry` 数组里注册：

```jsx
{
  id: "code-block",
  name: "代码块 CodeBlock",
  desc: "一句话描述",
  notes: ["第 3 步记录的观察要点", "..."],
  render: () => <CodeBlockDemo />,
}
```

首页会自动出现新卡片。

## 三、已验证的上游设计手法（复现时遵循）

1. **交互态 = `color-mix(in oklab, 前景色 5~24%, transparent)`**，不写死灰
2. **灰阶整列翻转**：亮主题 `--gray-0: #fff` ↔ 暗主题 `#0d0d0d`，引用语义灰阶即双主题
3. **层级靠透明叠加**：elevated 背景是 70%/96% 的白色混合
4. **圆角分级**：pill 按钮 999px / 卡片 16px / 列表项 8px / 输入容器 28px

## 四、建议的后续复现清单（按价值排序）

| 组件 | 关键词 | 研究价值 |
|---|---|---|
| ~~代码块~~ ✅ 已复现 | `chatgpt-code-block` | 语法高亮主题、复制按钮、圆角与边框处理 |
| ~~设置弹窗~~ ✅ 已复现 | `dialog` | 弹窗层级、遮罩、Toggle 开关 |
| ~~通知 Toast~~ ✅ 已复现 | `toast` | 反色胶囊 + 行内操作 |
| ~~头像/账户菜单~~ ✅ 已复现 | `avatar-*` / `profile` | 玻璃拟态、角标、骨架屏 steps(48) 扫光 |
| ~~流式打字光标~~ ✅ 已复现 | `streaming` | 块状光标、生成中才显示 |
| ~~引用/来源卡片~~ ✅ 已复现 | `chatgpt-sources-*` | 上标引用 + 卡片栅格 |
