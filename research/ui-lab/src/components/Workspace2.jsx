import {
  BranchIcon, FolderIcon, SearchIcon, XIcon, GearIcon,
  ChevronRightIcon, FileIcon, ClockIcon,
} from "../icons.jsx";

// ---- Worktrees settings page ---------------------------------------------------
const WORKTREES = [
  { name: "main", path: "~/code/codex-desktop-linux", branch: "main", current: true },
  { name: "feat-ui-lab", path: "~/code/.worktrees/feat-ui-lab", branch: "feat/ui-lab", current: false },
  { name: "hotfix-214", path: "~/code/.worktrees/hotfix-214", branch: "hotfix/214", current: false },
];

export function WorktreesSettings() {
  return (
    <div className="wts-page">
      <h3 className="wts-title">Worktrees</h3>
      <p className="wts-sub">
        每个 worktree 是独立的检出目录，Agent 任务在隔离环境中并行运行。
      </p>
      <div className="wts-list">
        {WORKTREES.map((w) => (
          <div key={w.name} className="wts-row">
            <BranchIcon size={16} />
            <div className="wts-info">
              <div className="wts-name">
                {w.name}
                {w.current && <span className="wts-badge">当前</span>}
              </div>
              <div className="wts-path">{w.path}</div>
            </div>
            <button className="icon-btn icon-btn-sm" aria-label="设置">
              <GearIcon size={15} />
            </button>
            <button className="icon-btn icon-btn-sm wts-remove" aria-label="删除">
              <XIcon size={15} />
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-secondary">+ 新建 worktree</button>
    </div>
  );
}

// ---- Terminal workspace warning (empty state) -----------------------------------
export function WorkspaceWarning() {
  return (
    <div className="ws-warning">
      <span className="ws-warning-icon"><FolderIcon size={24} /></span>
      <div className="ws-warning-title">终端未关联工作区</div>
      <p className="ws-warning-desc">
        当前会话没有可用的工作目录。选择一个工作区后，终端命令才会在其中执行。
      </p>
      <button className="btn btn-secondary">选择工作区</button>
    </div>
  );
}

// ---- Onboarding banner -----------------------------------------------------------
export function OnboardingBanner() {
  return (
    <div className="ob-banner">
      <span className="ob-icon"><BranchIcon size={20} /></span>
      <div className="ob-body">
        <div className="ob-title">试试并行任务</div>
        <div className="ob-desc">
          为每个任务创建独立的 worktree，多个 Agent 互不干扰地同时工作。
        </div>
        <div className="ob-actions">
          <button className="btn btn-primary ob-cta">了解详情</button>
          <button className="btn btn-tertiary">知道了</button>
        </div>
      </div>
      <button className="icon-btn icon-btn-sm ob-close" aria-label="关闭">
        <XIcon size={15} />
      </button>
    </div>
  );
}

// ---- File context menu ------------------------------------------------------------
export function FileContextMenu() {
  return (
    <div className="menu-panel ctx-menu">
      <div className="menu-item ctx-item"><FileIcon size={15} />打开</div>
      <div className="menu-item ctx-item"><ChevronRightIcon size={15} />在终端中打开</div>
      <div className="menu-item ctx-item"><ClockIcon size={15} />查看历史</div>
      <div className="menu-sep" />
      <div className="menu-item ctx-item"><FolderIcon size={15} />在文件夹中显示</div>
      <div className="menu-item ctx-item"><FileIcon size={15} />复制路径</div>
      <div className="menu-sep" />
      <div className="menu-item ctx-item menu-item-danger"><XIcon size={15} />删除</div>
    </div>
  );
}

// ---- Switch workspace dialog -------------------------------------------------------
const SPACES = [
  { name: "个人空间", meta: "12 个项目", letter: "个", active: true },
  { name: "Merisit Team", meta: "团队 · 34 个项目", letter: "M", active: false },
  { name: "开源贡献", meta: "5 个项目", letter: "开", active: false },
];

export function SwitchWorkspaceDialog() {
  return (
    <div className="overlay">
      <div className="dialog" style={{ width: "min(420px, 100%)" }}>
        <header className="dialog-header">
          <h3 className="dialog-title">切换工作空间</h3>
          <button className="icon-btn icon-btn-sm" aria-label="关闭">✕</button>
        </header>
        <div style={{ padding: "0 16px 8px" }}>
          <div className="emoji-search">
            <SearchIcon size={14} />
            <input placeholder="搜索工作空间" />
          </div>
        </div>
        <div className="wts-list" style={{ margin: "0 8px 12px" }}>
          {SPACES.map((s) => (
            <div key={s.name} className={`wts-row space-row ${s.active ? "active" : ""}`}>
              <span className="space-avatar">{s.letter}</span>
              <div className="wts-info">
                <div className="wts-name">{s.name}</div>
                <div className="wts-path">{s.meta}</div>
              </div>
              {s.active && <span className="menu-check">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
