import { useEffect, useState } from "react";
import { ButtonsDemo, Composer } from "./components/Buttons.jsx";
import { MessagesDemo, AgentMessagesDemo } from "./components/Messages.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { ModelPill, TooltipDemo, ShimmerDemo } from "./components/Misc.jsx";
import { CodeBlock, InlineCodeDemo } from "./components/CodeBlock.jsx";
import { SettingsDialog, ToastDemo } from "./components/Overlays.jsx";
import {
  AccountMenu,
  StreamingDemo,
  SkeletonDemo,
  SourcesDemo,
} from "./components/Social.jsx";
import { ChatPage } from "./components/ChatPage.jsx";
import { ModeToggle, TerminalPanel, DiffCard } from "./components/Agent.jsx";
import { FormControls, EmojiPicker, DatePickerPanel } from "./components/Forms.jsx";
import { WorktreeDropdown, EditorTabs, BrowserPanel } from "./components/Panels.jsx";
import {
  WorkspaceSelectPage, WorkspaceRootDialog, FileTreePane, ProjectChip,
} from "./components/Workspace.jsx";
import {
  WorktreesSettings, WorkspaceWarning, OnboardingBanner,
  FileContextMenu, SwitchWorkspaceDialog,
} from "./components/Workspace2.jsx";
import { BackIcon, SunIcon, MoonIcon } from "./icons.jsx";

const registry = [
  {
    id: "buttons",
    name: "按钮 Buttons",
    desc: "primary / secondary / tertiary / danger，令牌驱动的 hover/active 态",
    notes: [
      "背景色来自 --app-color-background-button-* 令牌",
      "hover/active 不是固定灰色，而是 color-mix 前景色的 5%/10% 透明混合",
      "圆角 999px（全圆角 pill）",
    ],
    render: () => <ButtonsDemo />,
  },
  {
    id: "composer",
    name: "输入框 Composer",
    desc: "Agent 主输入区：已按真实应用 CDP 实测修正（640px 宽几何数据）",
    notes: [
      "主行（y=62）：[+] 居左；[5.4 High ▾]（模型+推理档, w=69）与 [Send] 居右同行",
      "rail 在边框盒之外（y=104）：[项目 chip w=156] [Plugins] 居左，[运行位置] 图标居右",
      "Codex Agent 版无麦克风按钮（那是 ChatGPT 消费版元素）",
      "容器 28px 圆角 + 1px 8% 边框 + 聚焦加深；发送钮实心圆",
    ],
    render: () => (
      <div style={{ maxWidth: 640, width: "100%" }}>
        <Composer />
      </div>
    ),
  },
  {
    id: "messages",
    name: "消息 Messages",
    desc: "用户气泡右对齐灰底，助手消息无气泡 + 底部操作行",
    notes: [
      "用户气泡：bg = secondary 混合色，圆角 24px，右对齐",
      "助手消息无背景气泡，与阅读宽度对齐（约 44rem）",
      "操作行（复制/赞/重试）16px 小图标钮",
    ],
    render: () => <MessagesDemo />,
  },
  {
    id: "agentmessages",
    name: "Agent 消息流 Agent Messages",
    desc: "CDP 实测的 Codex 会话组件：工作日志行、变更审查条、Agent 版操作集",
    notes: [
      "Agent 版操作集不同：用户消息=Copy/Edit，助手=Copy/Fork（无点赞/重试）",
      "WorkLogRow：可折叠的「Worked for 3m 14s」，占满整行阅读列（x=729）",
      "ReviewBar：「Review changed files +N」居左，Undo/Review 按钮居右",
    ],
    render: () => <AgentMessagesDemo />,
  },
  {
    id: "sidebar",
    name: "侧边栏 Sidebar",
    desc: "CDP 实测重写：宽 275，模式切换 + 导航行 + Projects/Recents 分区",
    notes: [
      "顶部：模式切换胶囊（h=32）+ Search 图标；导航行 h=30（New chat/Pull requests/Scheduled/Plugins）",
      "Projects/Recents 分区头右侧有 options/新建 小按钮（h=25）",
      "会话行 hover 才显示 Pin/Archive 动作（19×20）",
      "背景比主区深半档，列表项圆角 8px，透明混合 hover",
    ],
    render: () => <Sidebar />,
  },
  {
    id: "modelpill",
    name: "模型选择 Model Pill",
    desc: "顶栏模型切换胶囊按钮与下拉面板",
    notes: [
      "胶囊按钮 hover 出现底色，chevron 16px",
      "下拉面板：圆角 16px、8% 边框、 elevated 背景 + 大阴影",
      "菜单项内含标题 + 次要描述两行",
    ],
    render: () => <ModelPill open />,
  },
  {
    id: "tooltip",
    name: "提示 Tooltip",
    desc: "深色小胶囊提示（悬停查看）",
    notes: ["反色背景（dark 主题下为浅色）", "圆角 8px，字号 12px"],
    render: () => <TooltipDemo />,
  },
  {
    id: "shimmer",
    name: "加载微光 Shimmer",
    desc: "思考中的文字微光扫过动画",
    notes: [
      "linear-gradient 扫过 + background-clip: text",
      "上游 index.html 启动屏也使用同样的 shimmer 变量",
    ],
    render: () => <ShimmerDemo />,
  },
  {
    id: "codeblock",
    name: "代码块 Code Block",
    desc: "带语言栏与复制按钮的代码块，以及行内代码样式",
    notes: [
      "表面色用 --gray-50（亮 #f9f9f9 / 暗 #131313），1px 8% 边框，圆角 12px",
      "头部行：语言名 12px 等宽 + 复制按钮（hover 才加深文字）",
      "语法高亮直接取调色板 token（blue/green/orange/purple），双主题天然可读",
    ],
    render: () => (
      <div className="demo-col" style={{ width: "100%", maxWidth: "40rem" }}>
        <CodeBlock />
        <InlineCodeDemo />
      </div>
    ),
  },
  {
    id: "dialog",
    name: "设置弹窗 Dialog",
    desc: "模态弹窗 + 开关 Toggle（上游 dialog chunk 的布局规律）",
    notes: [
      "遮罩：color-mix(黑 45%, transparent)；面板 elevated 背景 + 16px 圆角 + 大阴影",
      "上游 dialog 宽度用 min(spacing*180, 100vw - spacing*8)，小屏退化为全屏",
      "Toggle：38×22 胶囊 + 18px 旋钮，开启态跟随主按钮色",
    ],
    render: () => <SettingsDialog />,
  },
  {
    id: "toast",
    name: "通知 Toast",
    desc: "底部深色胶囊通知，可带撤销等行内操作",
    notes: [
      "反色设计：前景色做底、背景色做字（与 Tooltip 同一套反色语言）",
      "圆角 12px，操作按钮仅靠字重区分",
    ],
    render: () => <ToastDemo />,
  },
  {
    id: "account",
    name: "账户菜单 Account Menu",
    desc: "头像按钮（带状态角标）+ 账户下拉面板",
    notes: [
      "头像：32px 渐变圆 + 10px 状态点（2px 描边切出悬浮感）",
      "面板头部是 40px 大头像 + 双行文字，复用 menu-panel 体系",
      "危险项（退出登录）用 --app-color-text-error 而非红色背景",
    ],
    render: () => (
      <div style={{ paddingBottom: 220 }}>
        <AccountMenu />
      </div>
    ),
  },
  {
    id: "streaming",
    name: "流式输出 Streaming",
    desc: "打字机效果的回答输出 + 块状闪烁光标",
    notes: [
      "光标：8px 宽圆角块，steps(2) 离散闪烁（0.9s 一周期）",
      "输出完成光标即消失——上游同样是「生成中才显示光标」",
      "下方骨架屏复刻上游 profile chunk 的技巧：steps(48,end) 2.6s 扫过 + background-attachment: fixed",
    ],
    render: () => (
      <div className="demo-col" style={{ gap: 32 }}>
        <StreamingDemo />
        <SkeletonDemo />
      </div>
    ),
  },
  {
    id: "sources",
    name: "引用来源 Sources",
    desc: "行内上标引用标记 + 来源卡片栅格",
    notes: [
      "引用标记：10px 超小 pill，super 上标对齐，hover 加深",
      "来源卡：favicon 方块(16px, 4px 圆角) + 域名 11px + 标题两行截断",
      "hover 时上浮 1px + 投影，与卡片区分开层级",
    ],
    render: () => <SourcesDemo />,
  },
  {
    id: "chatpage",
    name: "完整聊天页 Chat Page",
    desc: "收官拼装：侧边栏 + 顶栏（模型/账户）+ 消息流 + 输入框，验收令牌体系的协同效果",
    notes: [
      "整页没有写任何新颜色——全部复用组件与令牌，证明体系可组合",
      "三栏节奏：侧边栏 260px / 阅读列 44rem / 输入框与阅读列同宽",
      "顶栏菜单已可点击开合（Radix 式的 trigger + panel 模式）",
    ],
    render: () => <ChatPage />,
    wide: true,
  },
  {
    id: "modetoggle",
    name: "模式切换 Mode Toggle",
    desc: "输入框上方的聊天/代理/计划分段切换（可点击）",
    notes: [
      "滑块指示器：0.5px 边框 + 投影 + elevated 背景（上游同款参数）",
      "选中项只是文字加深，背景变化全由滑块承担",
      "transform 位移切换，200ms ease",
    ],
    render: () => <ModeToggle />,
  },
  {
    id: "terminal",
    name: "终端面板 Terminal",
    desc: "内嵌终端：窗口按钮头 + ANSI 风格输出（Agent 的执行窗口）",
    notes: [
      "背景映射 --gray-50 表面令牌，亮主题是真·浅色终端（与上游 xterm 面板一致）",
      "ANSI 色不取终端默认色板，而取设计令牌（green/orange 等）保证主题协调",
      "滚动条上游用 10px + border 色，悬停加深",
    ],
    render: () => <TerminalPanel />,
  },
  {
    id: "diff",
    name: "Diff 卡片 Diff Card",
    desc: "代码变更展示：文件头统计 + 行级增删高亮",
    notes: [
      "增删行背景 = color-mix(green/red 10%, transparent)，不是实心红绿",
      "hunk 行（@@）用 blue-400 弱强调",
      "± 标记放独立 gutter 列，与代码对齐",
    ],
    render: () => <DiffCard />,
  },
  {
    id: "forms",
    name: "表单控件 Form Controls",
    desc: "文本输入 / 下拉按钮 / 滑杆 / 复选框 / 单选（Agent 设置页基础）",
    notes: [
      "滑杆复刻上游 input-selector：24px 轨道区、白色 20px 圆形拇指 + 1px 边 + 投影",
      "聚焦色走 --app-color-border-focus，不写死蓝色",
      "选中态统一用主按钮色（亮主题黑、暗主题白），check 标记反色",
    ],
    render: () => <FormControls />,
  },
  {
    id: "emojipicker",
    name: "表情选择 Emoji Picker",
    desc: "搜索框 + 8 列网格的表情弹层（消息反应/昵称常用）",
    notes: [
      "上游直接给 emoji-picker-react 换肤：背景/描边/hover 全映射到令牌",
      "搜索框用次级背景胶囊，无独立边框",
      "hover/focus 两态用 tertiary-hover 与 secondary-active 区分",
    ],
    render: () => <EmojiPicker />,
  },
  {
    id: "datepicker",
    name: "日期选择 Date Picker",
    desc: "月份网格弹层：选中实心圆、今天描边圆（Radix Popover 模式）",
    notes: [
      "弹层三件套：elevated 背景 + hairline 边框 + 复合投影（上游 Popover 公式）",
      "今天 = 1px 内描边，选中 = 主色实心圆，层级分明",
      "cell 用 aspect-ratio:1 保持正圆",
    ],
    render: () => <DatePickerPanel />,
  },
  {
    id: "worktree",
    name: "环境切换 Worktree Dropdown",
    desc: "Git worktree / 云端环境的切换下拉（Agent 的运行上下文选择器）",
    notes: [
      "触发器 = 分支图标 + 名字胶囊，面板复用 menu-panel 体系",
      "每项双行：名字 + 状态元信息（改动数 / 容器状态）",
      "「新建环境…」放分隔线后，是上游菜单的固定收尾模式",
    ],
    render: () => (
      <div style={{ paddingBottom: 260 }}>
        <WorktreeDropdown />
      </div>
    ),
  },
  {
    id: "editor",
    name: "编辑器标签 Editor Tabs",
    desc: "文件标签栏（未保存圆点）+ 带行号的只读编辑器（Agent 查看/修改文件）",
    notes: [
      "活动标签与内容区融为一体：上圆角 + 下边框 -1px 重叠",
      "未保存 = 橙色圆点替代关闭按钮（dirty 状态的通用语言）",
      "高亮行 = blue-400 8% 底 + 2px 左侧内描边（注释锚点样式）",
    ],
    render: () => <EditorTabs />,
  },
  {
    id: "browser",
    name: "浏览器面板 Browser Preview",
    desc: "内嵌浏览器：导航栏 + URL 胶囊 + 视口（Agent 的网页操作窗口）",
    notes: [
      "chrome 区用 surface 背景与视口分层，URL 是无边框胶囊",
      "导航按钮全部 28px 小图标钮，无文字",
      "视口内容的灰块卡片复用 secondary 背景令牌",
    ],
    render: () => <BrowserPanel />,
  },
  {
    id: "wsselect",
    name: "工作区选择页 Workspace Select",
    desc: "Agent 启动屏：选择文件夹 + 最近打开列表（对应 select-workspace-page）",
    notes: [
      "居中卡片：大圆角图标块 + 20px 标题 + 一句话说明 + 主按钮",
      "最近项 = 等宽字体路径 + 右侧时间戳（时钟小图标）",
      "整页用 surface 背景与主窗口分层",
    ],
    render: () => <WorkspaceSelectPage />,
    wide: true,
  },
  {
    id: "wsroot",
    name: "目录选择弹窗 Workspace Root",
    desc: "面包屑 + 目录列表的文件夹选择对话框（remote-workspace-root-dialog）",
    notes: [
      "面包屑是等宽字体胶囊，当前段加粗",
      "目录行右侧 chevron 仅 40% 透明度，hover 整行才强调",
      "底部按钮右对齐：tertiary 取消 + primary 确认",
    ],
    render: () => <WorkspaceRootDialog />,
  },
  {
    id: "filetree",
    name: "文件树 File Tree",
    desc: "变更审查侧栏：缩进层级 + Git 状态标记（review-file-tree-pane）",
    notes: [
      "缩进 16px/级，目录用 chevron 开合，文件用 13px 占位对齐",
      "Git 状态单字母着色：M 橙 / A 绿 / D 红，10px 粗体",
      "头部计数是 secondary 底色的数字 pill",
    ],
    render: () => <FileTreePane />,
  },
  {
    id: "projchip",
    name: "项目芯片 Project Chip",
    desc: "输入框工具条上的当前目录标识（composer-project-selector）",
    notes: [
      "12.5px 小胶囊：文件夹图标 + 目录名 + chevron",
      "secondary 背景，与 Composer 工具条的其他 icon-btn 区分层级",
    ],
    render: () => <ProjectChip />,
  },
  {
    id: "wtsettings",
    name: "Worktree 设置 Worktrees Settings",
    desc: "worktree 列表管理：当前标记、路径、删除操作（worktrees-settings-page）",
    notes: [
      "行式卡片：12px 圆角 + 1px 边框，图标 70% 透明度",
      "「当前」是 secondary 底色的小 badge，不用彩色",
      "删除钮 hover 才变错误色——危险动作不常驻红色",
    ],
    render: () => <WorktreesSettings />,
  },
  {
    id: "wswarning",
    name: "工作区警告空态 Warning State",
    desc: "终端未关联工作区时的引导空态（terminal-workspace-warning-state）",
    notes: [
      "虚线边框容器 = 「待填充」的通用语言",
      "三段式：圆形图标底 + 15px 标题 + 13px 描述 + secondary 按钮",
      "空态不用大色块，全部中性色",
    ],
    render: () => <WorkspaceWarning />,
  },
  {
    id: "onboarding",
    name: "引导横幅 Onboarding Banner",
    desc: "新功能引导卡：渐变图标 + 双按钮 + 角落关闭（worktree-onboarding-banner）",
    notes: [
      "唯一的彩色元素是 40px 渐变图标块——引导卡的焦点设计",
      "CTA 用 13px 小号主按钮，次级动作仅 tertiary 文字钮",
      "关闭钮绝对定位角落，不参与布局",
    ],
    render: () => <OnboardingBanner />,
  },
  {
    id: "ctxmenu",
    name: "文件右键菜单 Context Menu",
    desc: "文件树右键操作菜单（workspace-file-context-menu）",
    notes: [
      "与下拉面板同体系但更窄（220px），项内图标 65% 透明度",
      "分隔线把「查看 / 系统 / 危险」三组动作切开",
      "危险项依旧只用错误色文字",
    ],
    render: () => <FileContextMenu />,
  },
  {
    id: "switchspace",
    name: "空间切换 Switch Workspace",
    desc: "个人/团队空间切换弹窗：搜索 + 头像列表（business-switch-workspace-dialog）",
    notes: [
      "搜索框复用 emoji-search 的胶囊样式——组件内部复用",
      "空间头像是 8px 圆角方块（区别于用户的圆形头像）",
      "当前空间 = focus 色边框 + ✓，双重标记",
    ],
    render: () => <SwitchWorkspaceDialog />,
  },
];

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ui-lab-theme") || "light",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ui-lab-theme", theme);
  }, [theme]);
  return [theme, setTheme];
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [theme, setTheme] = useTheme();
  const selected = registry.find((c) => c.id === selectedId);

  return (
    <div className="app">
      <header className="app-header">
        {selected ? (
          <button className="icon-btn" onClick={() => setSelectedId(null)} aria-label="返回">
            <BackIcon />
          </button>
        ) : (
          <span className="app-brand">UI Lab</span>
        )}
        <h1 className="app-title">{selected ? selected.name : "组件复现实验"}</h1>
        <div className="composer-spacer" />
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="切换主题"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </header>

      {selected ? (
        <main className={`detail ${selected.wide ? "detail-wide" : ""}`}>
          <p className="detail-desc">{selected.desc}</p>
          <div className={`stage ${selected.wide ? "stage-wide" : ""}`}>{selected.render()}</div>
          <section className="notes">
            <h2>观察要点</h2>
            <ul>
              {selected.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
        </main>
      ) : (
        <main className="home">
          <p className="home-intro">
            基于从上游 CSS 提取的 {421} 个设计令牌，用 React 复现的组件样式实验。
            点击卡片查看组件。仅用于个人学习研究。
          </p>
          <div className="card-grid">
            {registry.map((c) => (
              <button key={c.id} className="card" onClick={() => setSelectedId(c.id)}>
                <div className="card-name">{c.name}</div>
                <div className="card-desc">{c.desc}</div>
              </button>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
