import { useState } from "react";
import {
  FolderIcon, FolderOpenIcon, ChevronRightIcon, ChevronDownIcon,
  ClockIcon, FileIcon,
} from "../icons.jsx";

// ---- Workspace select page (Agent 启动屏) -------------------------------------
const RECENT = [
  { path: "~/code/codex-desktop-linux", when: "2 分钟前" },
  { path: "~/code/my-ai-agent", when: "昨天" },
  { path: "~/code/notes", when: "3 天前" },
];

export function WorkspaceSelectPage() {
  return (
    <div className="ws-page">
      <div className="ws-card">
        <span className="ws-logo"><FolderOpenIcon size={28} /></span>
        <h2 className="ws-title">选择工作区</h2>
        <p className="ws-sub">Agent 将在该目录中读写文件、执行命令</p>
        <button className="btn btn-primary ws-open">
          <FolderIcon size={16} /> 选择文件夹…
        </button>
        <div className="ws-recent-label">最近打开</div>
        <div className="ws-recent">
          {RECENT.map((r) => (
            <button key={r.path} className="ws-recent-item">
              <FolderIcon size={16} />
              <span className="ws-path">{r.path}</span>
              <span className="ws-when"><ClockIcon size={13} />{r.when}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Workspace root dialog (目录选择) ------------------------------------------
const DIRS = ["code", "Documents", "Downloads", "notes", "Pictures"];

export function WorkspaceRootDialog() {
  return (
    <div className="overlay">
      <div className="dialog" style={{ width: "min(440px, 100%)" }}>
        <header className="dialog-header">
          <h3 className="dialog-title">选择工作目录</h3>
          <button className="icon-btn icon-btn-sm" aria-label="关闭">✕</button>
        </header>
        <div className="ws-crumb">
          <span>~</span><ChevronRightIcon size={12} /><span className="ws-crumb-cur">blackrock</span>
        </div>
        <div className="ws-dirlist">
          {DIRS.map((d) => (
            <button key={d} className="ws-dir-item">
              <FolderIcon size={16} />
              <span>{d}</span>
              <ChevronRightIcon size={14} className="ws-dir-go" />
            </button>
          ))}
        </div>
        <footer className="ws-dialog-footer">
          <button className="btn btn-tertiary">取消</button>
          <button className="btn btn-primary">选择此目录</button>
        </footer>
      </div>
    </div>
  );
}

// ---- File tree pane (变更审查) --------------------------------------------------
const TREE = [
  { depth: 0, type: "dir", open: true, name: "src" },
  { depth: 1, type: "dir", open: true, name: "components" },
  { depth: 2, type: "file", name: "Agent.jsx", status: "M" },
  { depth: 2, type: "file", name: "Workspace.jsx", status: "A" },
  { depth: 1, type: "file", name: "App.jsx", status: "M" },
  { depth: 0, type: "file", name: "package.json" },
  { depth: 0, type: "file", name: "vite.config.js", status: "D" },
];

export function FileTreePane() {
  const [selected, setSelected] = useState("Workspace.jsx");
  return (
    <div className="ftree">
      <div className="ftree-header">变更文件 <span className="ftree-count">4</span></div>
      {TREE.map((n) => (
        <button
          key={n.name}
          className={`ftree-item ${selected === n.name ? "active" : ""}`}
          style={{ paddingLeft: 8 + n.depth * 16 }}
          onClick={() => setSelected(n.name)}
        >
          {n.type === "dir" ? (
            <>
              {n.open ? <ChevronDownIcon size={13} /> : <ChevronRightIcon size={13} />}
              <FolderOpenIcon size={14} />
            </>
          ) : (
            <>
              <span style={{ width: 13 }} />
              <FileIcon size={14} />
            </>
          )}
          <span className="ftree-name">{n.name}</span>
          {n.status && <span className={`ftree-status ftree-${n.status}`}>{n.status}</span>}
        </button>
      ))}
    </div>
  );
}

// ---- Composer project chip -------------------------------------------------------
export function ProjectChip() {
  return (
    <div className="demo-col" style={{ gap: 8 }}>
      <button className="proj-chip">
        <FolderIcon size={14} />
        <span>codex-desktop-linux</span>
        <ChevronDownIcon size={13} />
      </button>
      <p className="menu-item-desc" style={{ margin: 0 }}>
        固定在输入框工具条左侧，标识 Agent 当前的工作目录
      </p>
    </div>
  );
}
