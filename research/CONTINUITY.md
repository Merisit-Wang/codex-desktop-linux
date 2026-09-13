# 交接文档：如何在新环境中继续这项研究

> 最后更新：2026-09-13 · 分支 `research/ui-component-study`
> 本文档包含继续探索所需的全部上下文，新环境克隆分支后从这里开始。

## 0. 30 秒总览

研究 OpenAI 统一桌面应用（owl 外壳，v26.908.40834；Linux 品牌 ChatGPT、
mac/Win 品牌 Codex，**UI 已实证一致**）的设计系统，产出：

| 资产 | 位置 | 状态 |
|---|---|---|
| 421 个设计令牌（双主题具体值） | `research/ui-lab/src/tokens.css` | ✅ |
| 31 个 React 复现组件 | `research/ui-lab/src/components/` | ✅ 部分已经 CDP 实测校准 |
| 令牌解析器 | `research/ui-lab/scripts/gen-tokens.mjs` | ✅ |
| CDP 实测工具 | `research/upstream-ui/cdp.mjs` | ✅ |
| 方法论 + 复现清单 | `research/README.md` | ✅ |
| Rebuild 版 Linux 跑通记录 | `research/codex-rebuild-linux-notes.md` | ✅ |

## 1. 新环境起步（按序执行）

```bash
git clone -b research/ui-component-study \
  git@github.com:Merisit-Wang/codex-desktop-linux.git
cd codex-desktop-linux

# (a) 重建上游解包产物（被 gitignore，必须本地生成）
cd research/upstream-ui
export GNUPGHOME="$PWD/.gnupg" && mkdir -p "$GNUPGHOME" && chmod 700 "$GNUPGHOME"
export npm_config_cache="$PWD/.npm-cache"
node ../../scripts/lib/upstream-linux-package.js \
  --output-dir deb --metadata upstream-metadata.json \
  --key-base64 ../../assets/openai-codex-linux-repository-key.gpg.base64 --arch amd64
dpkg-deb -x deb/chatgpt_*.deb extracted/
npx --yes @electron/asar extract extracted/usr/lib/chatgpt/resources/app.asar asar/app
# 美化主 CSS（令牌解析器的输入）
mkdir -p readable/css
for f in asar/app/webview/assets/app-*.css; do
  npx --yes prettier --write "$f" && cp "$f" readable/css/
done

# (b) 启动组件实验室
cd ../ui-lab && npm install && npm run gen:tokens && npm run dev
# → http://127.0.0.1:5179
```

**(c) 跑真实应用（CDP 实测的对照物）**，二选一：

```bash
# 选项 1：官方 Linux 载荷（推荐，最省事，CLI 原生可用）
cd /path/to/codex-desktop-linux
./install.sh research/upstream-ui/deb/chatgpt_*.deb
./codex-app/start.sh --remote-debugging-port=9223

# 选项 2：CodexDesktop-Rebuild（Codex 品牌，需打补丁，见
# research/codex-rebuild-linux-notes.md 的 11 项修复）
```

Wayland 环境注意：需要 `WAYLAND_DISPLAY=wayland-0 XDG_RUNTIME_DIR=/run/user/1000`
+ `--ozone-platform=wayland`（在桌面终端里直接跑通常不用）。

## 2. CDP 实测工作流（核心方法）

应用带 `--remote-debugging-port=9223` 启动后：

```bash
# 1. 列出目标，选 url 为 app://-/index.html 的那个（⚠️ 会有多个目标，
#    沙箱 iframe 也占一个，连错会拿到空页面）
curl -s http://127.0.0.1:9223/json | grep -E '"url"|"webSocketDebuggerUrl"'

# 2. 写一个 JS 表达式文件，然后执行
node research/upstream-ui/cdp.mjs /tmp/expr.js "ws://127.0.0.1:9223/devtools/page/<ID>"
```

表达式套路（已验证好用）：

```js
(() => {
  // 通过已知按钮锚定区域，向上找容器，向下量几何
  const anchor = [...document.querySelectorAll("button")]
    .find(b => /特征文字/.test(b.getAttribute("aria-label") || b.textContent));
  // getBoundingClientRect() 输出 x/y/w/h，文本截断输出
})()
```

**实测过的区域**（表达式可照 history 仿写）：composer 几何、sidebar 结构、
消息流/顶栏、斜杠命令面板（在 composer 内输入 `/` 后抓取）。

## 3. 已踩过的坑（别再踩）

| 坑 | 解法 |
|---|---|
| vite 缓存导致改代码不生效 | `npm run dev:fresh` 或 `rm -rf node_modules/.vite` |
| CDP 有多个 target（sandbox iframe） | 只连 `app://-/index.html` 的 ws URL |
| `pkill -f 路径` 会杀掉自己的 shell | 用 `pgrep -x <进程名> \| xargs -r kill` |
| 沙箱环境 `$HOME` 只读 | `GNUPGHOME`/`npm_config_cache` 指到项目内 |
| JSX 字符串里嵌英文引号 | 用「」或模板拼接；提交前跑 esbuild 语法检查 |
| 新组件渲染崩溃白屏 | 提交前跑 SSR 冒烟测试（renderToString），见 git 历史里的 render-test.jsx 写法 |

## 4. 继续探索的候选方向（按价值排序）

1. **Model / Reasoning 子菜单**——composer 里 `5.4 High` 触发器的下拉
   （实测方法：CDP 点击该按钮后抓 popper）
2. **Outputs / Sources 右侧边栏**——`Toggle side panel` 打开后测量
   （"Create a file or site"、"Attach files or connect apps"）
3. **Pull requests 页面**——sidebar 导航进入，Agent 的 PR 审查 UI
4. **Plan mode** 的 UI 差异（`/` → Plan mode 开启后 composer/消息流变化）
5. **MCP 状态面板**（`/` → MCP）
6. **Status 弹层**（`/` → Status：chat ID、context 用量、rate limits）
7. **Goal 的持续任务 UI**（`/` → Goal 设定后的展示形态）
8. **Scheduled 定时任务页面**
9. 令牌解析器增强：`gen-tokens.mjs` 的 `interesting` 正则目前只收
   gray/blue/alpha/app-color/font 等前缀，遇到缺失令牌（如 syntax 色）时放宽

## 5. 复现新组件的标准流程（research/README.md 第二节详解）

定位 chunk → 提取令牌 → **CDP 运行时实测（新增，优先！）** →
ui-lab 重新实现 → SSR 冒烟测试 → `registry` 注册 → 提交推送

## 6. 关键事实备忘

- 上游 = 统一 owl 应用；Linux 包名 `chatgpt`，mac/Win 品牌 `Codex`，同版本同 webview
- 设计核心手法：交互态 = `color-mix(前景色 5~24%, transparent)`；灰阶整列翻转；层级靠透明叠加
- Agent 版 vs 消费版差异：模型选择在 composer（非顶栏）、无麦克风、助手操作是 Fork（非点赞/重试）、有 WorkLog/ReviewBar
- 许多组件受 Statsig 云控（Rebuild 项目的 STATSIG_GATES.md）
- Rebuild 版 Owl API 补丁清单见 codex-rebuild-linux-notes.md（sync-upstream 后需重打）
