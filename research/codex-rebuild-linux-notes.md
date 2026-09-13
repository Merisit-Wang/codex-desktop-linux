# 阶段记录：在 Linux 上跑通 Codex 桌面版（CodexDesktop-Rebuild）

> 日期：2026-09-13 · 版本：26.908.40834 (build 8881)
> 目标项目：`/home/blackrock/code/CodexDesktop-Rebuild`（Haleclipse/Cometix）

## 结论

Codex 品牌桌面版已在 Linux (Wayland) 上稳定运行：窗口正常、
codex CLI 握手成功（`outcome=success`）、持续在线。
并与 codex-desktop-linux 构建产物（官方 Linux deb）并排验证：
**两者 webview UI 完全一致**。

## 运行方式

```bash
cd ~/code/CodexDesktop-Rebuild
./out/Codex-linux-x64/Codex --ozone-platform=wayland
```

## 踩坑与修复全记录（11 项）

### A. 项目自身的 Linux 可移植性 bug（4 项）

| # | 问题 | 修复 | 位置 |
|---|---|---|---|
| 1 | `sync-upstream.js` 只认 `7zz/7z`，Linux 未装 | 增加 `unzip` 兜底（脚本注释本就说明 Linux 不需要保留符号链接） | `scripts/sync-upstream.js` `extractArchive()` |
| 2 | `better-sqlite3@12.9` 编译失败（Electron 42 的 V8 要求 `External::Value(tag)`） | 升级 `better-sqlite3@^13.0.3` | `package.json` |
| 3 | npm 默认源下载 Electron 二进制 TLS 失败 | `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/` + `node node_modules/electron/install.js` | 环境变量 |
| 4 | Linux 分支不生成 `src/.vite/build/bootstrap.js`，但 root package.json main 指向它 → forge 校验失败 | `prepare-src.js` 增加 Linux 分支：生成 `require("./early-bootstrap.js")` 转发 stub | `scripts/prepare-src.js` |

### B. Owl shell 私有 API（官方 Electron 缺失，7 项）

新版应用**拒绝在官方 Electron 上运行**，且主/渲染进程多处直接调用
Owl 定制 API。修复 = early-bootstrap 统一 stub + 个别调用点可选调用化：

| # | API | 对象 | 处理 |
|---|---|---|---|
| 5 | `showTaskManager` 存在性检查（启动即 throw） | `app` | 绕过检查并 stub 为 no-op |
| 6 | `begin/endNativeMenuTracking`、`setDebugChromePagesEnabled`、`setRuntimeFeatures`、`isRuntimeFeatureEnabled` | `app` | early-bootstrap 前置 stub（`isRuntimeFeatureEnabled` 返回 `false`） |
| 7 | `setWebsiteReportingEnabled` | `Session` | 调用点改 `?.`（2 处，`window-all-closed-*.js`） |
| 8 | `isAlwaysOnTopSupported`、`isInputShapeSupported`、`isSystemBackdropSupported`、`isBeaconSupported` | `BrowserWindow` 静态 | stub 返回 `false`（语义正确：不支持） |
| 9 | `setInputShape` | `BrowserWindow.prototype` | stub no-op |
| 10 | `setPreferredLanguages` | `Session` | 调用点改 `?.`（1 处，`main-*.js`） |

early-bootstrap 前置 stub 块（当前注入在两份 `_asar` 缓存中）：

```js
try {
  const { app: _a, BrowserWindow: _B } = require("electron");
  for (const _k of ["beginNativeMenuTracking","endNativeMenuTracking",
      "setDebugChromePagesEnabled","setRuntimeFeatures","showTaskManager"])
    typeof _a[_k] != "function" && (_a[_k] = () => {});
  _a.isRuntimeFeatureEnabled ??= (() => !1);
  for (const _k of ["isAlwaysOnTopSupported","isInputShapeSupported",
      "isSystemBackdropSupported","isBeaconSupported"])
    typeof _B[_k] != "function" && (_B[_k] = () => !1);
  for (const _k of ["setInputShape"])
    typeof _B.prototype[_k] != "function" && (_B.prototype[_k] = function(){});
} catch (_e) {}
```

诊断技巧：应用把启动错误只发给 Sentry，日志里只有
`phase=bootstrap-import-main`。在 `bootstrap-*.js` 的 catch 里注入
`console.error("BOOTSTRAP-FAIL", e && e.stack || e)` 才能拿到真实堆栈。

### C. 内置 CLI 平台错误（1 项，致命）

| # | 问题 | 修复 |
|---|---|---|
| 11 | `resources/codex`、`resources/rg` 是 Mach-O（mac）二进制，Linux 无法执行；app-server 握手失败被当作致命错误退出 | 用本机 `@openai/codex` npm 包里的 Linux 原生二进制替换：`@openai/codex-linux-x64/vendor/x86_64-unknown-linux-musl/{codex/codex, path/rg}`。握手 `outcome=success`（CLI 0.121 被接受） |

注意：`prepare-src.js` 想从 `@cometix/codex` 拉 Linux CLI，但包名拼接有
bug（`@cometix/codex@-linux-x64`），拉取失败后静默保留 mac 二进制。
另外 forge **package 每次都会覆盖 `out/`，CLI 替换需要在 package 之后重做**。

## 已知遗留（不致命）

- `session.getDownloadHistory` 缺失 → 下载历史功能为空（错误已被应用捕获）
- `codex://` 协议处理器注册失败（Linux desktop entry 未配置）
- `allowDevtools=false`：项目的 patch 步骤（`npm run patch`）独立于构建，
  本次未执行；需要 DevTools 时先跑 `node scripts/patch-all.js mac-arm64` 再重建
- codex CLI 0.121 偏旧（app 26.908 预期更新的 app-server 协议），
  握手虽通过，个别新功能可能不可用

## 重建流程（上游更新后）

```bash
cd ~/code/CodexDesktop-Rebuild
export npm_config_cache="$PWD/.npm-cache"
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
node scripts/sync-upstream.js --skip-win        # 拉新 mac 上游
# 重打 B 组 Owl 补丁（sync 会覆盖 _asar）
npm run build:linux-x64                          # prepare + rebuild + forge（rpm 会失败可忽略）
# 或手动：npx electron-forge package --platform=linux --arch=x64
# 最后重做 C 组 CLI 替换
```

## 建议回馈上游（PR 素材）

1. `sync-upstream.js`：unzip 兜底
2. `prepare-src.js`：Linux 的 bootstrap.js 转发 stub + 修 `@cometix/codex` 包名拼接
3. 新增 `scripts/patch-owl-shell.js`：B 组 stub/可选调用补丁，纳入 `patch-all.js`
4. `package.json`：better-sqlite3 ^13（mac/win 同样需要，Electron 42 共性问题）
