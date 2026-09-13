import { useState } from "react";
import {
  BranchIcon, LockIcon, ReloadIcon, BackIcon, ArrowRightIcon,
  ChevronDownIcon, FileIcon, XIcon, PlusIcon,
} from "../icons.jsx";

// ---- Worktree / environment dropdown ----------------------------------------
const ENVS = [
  { name: "main", meta: "干净的工作区", current: false },
  { name: "feat/ui-lab", meta: "3 个未提交改动", current: true },
  { name: "cloud: agent-env-01", meta: "云端容器 · 运行中", current: false },
];

export function WorktreeDropdown() {
  const [open, setOpen] = useState(true);
  return (
    <div className="model-pill-wrap">
      <button className="env-trigger" onClick={() => setOpen(!open)}>
        <BranchIcon size={16} />
        <span className="env-name">feat/ui-lab</span>
        <ChevronDownIcon size={14} />
      </button>
      {open && (
        <div className="menu-panel env-panel">
          <div className="menu-item env-item active">
            <BranchIcon size={16} />
            <div>
              <div className="menu-item-title">feat/ui-lab</div>
              <div className="menu-item-desc">3 个未提交改动</div>
            </div>
            <span className="menu-check">✓</span>
          </div>
          {ENVS.filter((e) => !e.current).map((e) => (
            <div key={e.name} className="menu-item env-item">
              <BranchIcon size={16} />
              <div>
                <div className="menu-item-title">{e.name}</div>
                <div className="menu-item-desc">{e.meta}</div>
              </div>
            </div>
          ))}
          <div className="menu-sep" />
          <div className="menu-item env-item">
            <PlusIcon size={16} />
            <div className="menu-item-title">新建环境…</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Editor tabs --------------------------------------------------------------
const TABS = [
  { name: "App.jsx", active: true, dirty: true },
  { name: "tokens.css", active: false },
  { name: "README.md", active: false },
];
const CODE = [
  'export function App() {',
  '  const [theme, setTheme] = useTheme();',
  '  // 令牌驱动，无需主题分支',
  '  return <Shell theme={theme} />;',
  '}',
];

export function EditorTabs() {
  return (
    <div className="editor">
      <div className="editor-tabs">
        {TABS.map((t) => (
          <div key={t.name} className={`editor-tab ${t.active ? "active" : ""}`}>
            <FileIcon size={13} />
            <span>{t.name}</span>
            {t.dirty ? <span className="editor-dirty" /> : <XIcon size={12} className="editor-close" />}
          </div>
        ))}
        <button className="icon-btn icon-btn-sm" aria-label="新标签">
          <PlusIcon size={14} />
        </button>
      </div>
      <div className="editor-body">
        {CODE.map((line, i) => (
          <div key={i} className={`editor-line ${i === 2 ? "highlight" : ""}`}>
            <span className="editor-ln">{i + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Browser preview panel -----------------------------------------------------
export function BrowserPanel() {
  return (
    <div className="browser">
      <div className="browser-chrome">
        <button className="icon-btn icon-btn-sm" aria-label="后退"><BackIcon size={14} /></button>
        <button className="icon-btn icon-btn-sm" aria-label="前进"><ArrowRightIcon size={14} /></button>
        <button className="icon-btn icon-btn-sm" aria-label="刷新"><ReloadIcon size={14} /></button>
        <div className="browser-url">
          <LockIcon size={12} />
          <span>127.0.0.1:5179/chatpage</span>
        </div>
      </div>
      <div className="browser-viewport">
        <div className="browser-hero">UI Lab 预览</div>
        <div className="browser-cards">
          <div className="browser-card" />
          <div className="browser-card" />
          <div className="browser-card" />
        </div>
      </div>
    </div>
  );
}
