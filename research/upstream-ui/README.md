# 上游 ChatGPT Linux 应用 UI 研究目录

本目录由签名 APT 仓库下载并验证的官方 `chatgpt` 包解包而来，仅用于个人学习研究。
上游代码与资源版权归 OpenAI 所有，请勿再分发。

- 版本：`chatgpt_26.908.40834_amd64`（见 `upstream-metadata.json`，含 SHA-256）
- 信任链：仓库固定 GPG 密钥 → `InRelease` → `Packages` → 包 SHA-256

## 目录结构

| 路径 | 内容 |
|---|---|
| `deb/` | 已验证签名的官方 deb 原始包 |
| `extracted/` | deb 解包结果（`usr/lib/chatgpt/` 为完整安装载荷） |
| `asar/app/` | `resources/app.asar` 解包结果（已合并 `app.asar.unpacked`） |
| `readable/css/` | prettier 美化后的三个主 CSS 包 |
| `readable/design-tokens.txt` | 从主 CSS 提取的全部 ~3200 个 CSS 自定义属性（按作用域分组） |
| `upstream-metadata.json` | 包元数据（版本、SHA-256、来源仓库） |

## asar 内部结构

- `asar/app/package.json` — 产品名 Codex，入口 `.vite/build/early-bootstrap.js`（Electron 主进程，Vite + electron-forge 构建）
- `asar/app/.vite/build/` — 主进程 bundle（8.4MB，minified）
- `asar/app/webview/index.html` — 渲染进程入口（含 CSP、启动屏 shimmer 动画内联样式）
- `asar/app/webview/assets/` — 渲染进程全部 JS/CSS chunk（~310MB，219 个 CSS、数千个 JS，文件名语义化）
- `asar/app/webview/apps/` — 各 IDE/终端图标素材（VS Code、Cursor、iTerm 等）
- `asar/app/native-menu-locales/` — 原生菜单多语言

## 技术栈判定（2026-09 版本）

- **React 19**（`react@19` / `react-dom@19`）
- **Tailwind CSS v4.3.3**（`@layer theme, base, components, utilities`，CSS 变量驱动）
- **设计 token 体系**：`--app-color-*` 系列变量（按钮、背景、状态、强调色），分 `:root` / `[data-theme="light"|"dark"]` 作用域，主作用域约 600–769 个 token
- **状态管理**：jotai（主）、zustand、valtio（局部）
- **UI 原语**：Radix UI + @floating-ui；图标 lucide
- **动画**：framer-motion / motion
- **数学渲染**：KaTeX 字体集；正文辅助字体 carlito

## 常用研究操作

```bash
# 美化任意一个 JS chunk 便于阅读（输出到新文件，不改动原始提取件）
npx --yes prettier asar/app/webview/assets/<chunk>.js > /tmp/out.js

# 在全部 chunk 中搜索某个组件/类名线索
grep -rl "composer" asar/app/webview/assets --include="*.js" | head

# 查看某主题的完整 token 值
grep -A800 '## :where(:root, \[data-theme\])' readable/design-tokens.txt | less
```

## 运行时动态审查（补充手段）

静态代码之外，UI 交互细节建议用 DevTools 实测：

```bash
/opt/codex-desktop/ChatGPT --remote-debugging-port=9222
# 浏览器打开 http://127.0.0.1:9222 审查 DOM / React 组件树
```

## 重新生成

```bash
export GNUPGHOME="$PWD/research/upstream-ui/.gnupg"
node scripts/lib/upstream-linux-package.js \
  --output-dir research/upstream-ui/deb \
  --metadata research/upstream-ui/upstream-metadata.json \
  --key-base64 assets/openai-codex-linux-repository-key.gpg.base64 \
  --arch amd64
dpkg-deb -x research/upstream-ui/deb/chatgpt_*.deb research/upstream-ui/extracted/
npx --yes @electron/asar extract \
  research/upstream-ui/extracted/usr/lib/chatgpt/resources/app.asar \
  research/upstream-ui/asar/app
```
