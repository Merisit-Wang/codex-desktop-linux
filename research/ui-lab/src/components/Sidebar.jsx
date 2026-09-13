import { ChatIcon, EditIcon, SearchIcon, SparkleIcon } from "../icons.jsx";

const conversations = [
  "CSS color-mix 原理",
  "React 19 新特性梳理",
  "周末爬山路线规划",
  "okr 草稿 review",
  "Electron 窗口圆角方案",
  "给猫起个名字",
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">
          <SparkleIcon size={22} />
        </span>
        <button className="icon-btn" aria-label="新对话">
          <EditIcon />
        </button>
      </div>
      <button className="sidebar-search">
        <SearchIcon size={16} />
        <span>搜索对话</span>
      </button>
      <div className="sidebar-section">最近</div>
      <nav className="sidebar-list">
        {conversations.map((title, i) => (
          <a
            key={title}
            className={`sidebar-item ${i === 0 ? "active" : ""}`}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <ChatIcon size={16} className="sidebar-item-icon" />
            <span className="sidebar-item-title">{title}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
