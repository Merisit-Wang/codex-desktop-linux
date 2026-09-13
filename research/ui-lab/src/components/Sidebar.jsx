import {
  SparkleIcon, SearchIcon, EditIcon, PullRequestIcon, CalendarIcon,
  PuzzleIcon, FolderIcon, DotsIcon, PlusIcon, PinIcon, ArchiveIcon,
  ChevronDownIcon,
} from "../icons.jsx";

// Sidebar measured from live app (CDP): width 275, mode switch h=32,
// nav rows h=30 (x=8,w=259), section headers h=25, hover actions 19px.
const RECENT_CHATS = [
  "docker pull stirling-pdf 报错排查",
  "修改ChatInput为暗色模式并参考图片配色",
  "按计划实现 ChatInput 组件",
  "创建ChatInput双区AI Agent输入组件",
  "创建 React TypeScript 项目",
];

function HoverActions() {
  return (
    <span className="chat-item-actions">
      <button className="icon-btn icon-btn-xs" aria-label="Pin chat"><PinIcon size={13} /></button>
      <button className="icon-btn icon-btn-xs" aria-label="Archive chat"><ArchiveIcon size={13} /></button>
    </span>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button className="mode-switch">
          <SparkleIcon size={16} />
          <span>Codex</span>
          <ChevronDownIcon size={14} />
        </button>
        <button className="icon-btn icon-btn-sm" aria-label="Search">
          <SearchIcon size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <button className="sidebar-row"><EditIcon size={16} /><span>New chat</span></button>
        <button className="sidebar-row"><PullRequestIcon size={16} /><span>Pull requests</span></button>
        <button className="sidebar-row"><CalendarIcon size={16} /><span>Scheduled</span></button>
        <button className="sidebar-row"><PuzzleIcon size={16} /><span>Plugins</span></button>
      </nav>

      <div className="sidebar-section-row">
        <button className="sidebar-section">Projects</button>
        <span className="sidebar-section-actions">
          <button className="icon-btn icon-btn-xs" aria-label="Project sidebar options"><DotsIcon size={14} /></button>
          <button className="icon-btn icon-btn-xs" aria-label="Add new project"><PlusIcon size={14} /></button>
        </span>
      </div>
      <button className="sidebar-row sidebar-project active">
        <FolderIcon size={16} />
        <span className="sidebar-item-title">codex-desktop-linux</span>
        <span className="chat-item-actions">
          <button className="icon-btn icon-btn-xs" aria-label="Project actions"><DotsIcon size={13} /></button>
        </span>
      </button>

      <div className="sidebar-section-row">
        <button className="sidebar-section">Recents</button>
        <span className="sidebar-section-actions">
          <button className="icon-btn icon-btn-xs" aria-label="Chat sidebar options"><DotsIcon size={14} /></button>
          <button className="icon-btn icon-btn-xs" aria-label="New chat"><EditIcon size={13} /></button>
        </span>
      </div>
      <nav className="sidebar-list">
        {RECENT_CHATS.map((title, i) => (
          <button key={title} className={`sidebar-row sidebar-chat ${i === 0 ? "active" : ""}`}>
            <span className="sidebar-item-title">{title}</span>
            <HoverActions />
          </button>
        ))}
      </nav>
    </aside>
  );
}
