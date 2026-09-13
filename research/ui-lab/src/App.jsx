import { useEffect, useState } from "react";
import { ButtonsDemo, Composer } from "./components/Buttons.jsx";
import { MessagesDemo } from "./components/Messages.jsx";
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
    desc: "聊天主输入区：大圆角容器 + 底部工具条 + 实心发送钮",
    notes: [
      "容器圆角 28px，边框 1px 8% 透明前景色",
      "聚焦时边框加深，整体带轻微阴影",
      "发送钮为实心圆（前景色/背景色反转）",
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
      "用户气泡：bg = --app-color-background-surface，圆角 24px，右对齐",
      "助手消息无背景气泡，与阅读宽度对齐（约 44rem）",
      "操作行（复制/赞/重试）16px 小图标钮",
    ],
    render: () => <MessagesDemo />,
  },
  {
    id: "sidebar",
    name: "侧边栏 Sidebar",
    desc: "对话列表：logo 区、搜索入口、分组标题、列表项 hover",
    notes: [
      "背景比主区深半档（light: #f9f9f9 / dark: #161616）",
      "列表项圆角 8px，hover 用前景 4% 透明混合",
      "当前项左侧无强调条，仅靠底色区分",
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
        <main className="detail">
          <p className="detail-desc">{selected.desc}</p>
          <div className="stage">{selected.render()}</div>
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
