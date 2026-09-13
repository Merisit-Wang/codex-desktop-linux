import { ArrowUpIcon, PaperclipIcon, MicIcon, PlusIcon, ChevronDownIcon, FolderIcon, PuzzleIcon, MonitorIcon } from "../icons.jsx";

// ---- Button -------------------------------------------------------------
export function Button({ variant = "primary", children, disabled }) {
  return (
    <button className={`btn btn-${variant}`} disabled={disabled}>
      {children}
    </button>
  );
}

export function ButtonsDemo() {
  return (
    <div className="demo-col">
      <div className="demo-row">
        <Button>主要按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="tertiary">三级按钮</Button>
        <Button variant="danger">危险按钮</Button>
      </div>
      <div className="demo-row">
        <Button disabled>禁用</Button>
        <Button variant="secondary" disabled>
          禁用
        </Button>
      </div>
      <div className="demo-row">
        <button className="icon-btn" aria-label="添加">
          <PaperclipIcon />
        </button>
        <button className="icon-btn" aria-label="语音">
          <MicIcon />
        </button>
        <button className="icon-btn icon-btn-solid" aria-label="发送">
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
}

// ---- Composer -----------------------------------------------------------
// Geometry measured from the live app (CDP, 640px wide):
//   input y=14; footer row y=62: [+](x8) ... [5.4 High](x527,w69) [Send](x604)
//   rail BELOW the bordered box (y=104): [project chip](w156) [Plugins](w85)
//   ... [run-location icon](x595). No mic in the Codex agent flavor.
export function Composer() {
  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          className="composer-input"
          rows={1}
          placeholder="Ask Codex to do something…"
        />
        <div className="composer-bar">
          <button className="icon-btn" aria-label="Add files and more">
            <PlusIcon />
          </button>
          <div className="composer-spacer" />
          <button className="intel-trigger" aria-label="Select model and reasoning effort">
            <span className="intel-model">5.4</span>
            <span className="intel-effort">High</span>
            <ChevronDownIcon size={14} />
          </button>
          <button className="icon-btn icon-btn-solid" aria-label="Send">
            <ArrowUpIcon />
          </button>
        </div>
      </div>
      <div className="composer-rail">
        <button className="proj-chip">
          <FolderIcon size={14} />
          <span>codex-desktop-linux</span>
          <ChevronDownIcon size={13} />
        </button>
        <button className="rail-btn">
          <PuzzleIcon size={14} />
          <span>Plugins</span>
        </button>
        <div className="composer-spacer" />
        <button className="icon-btn" aria-label="Choose where to run this chat">
          <MonitorIcon />
        </button>
      </div>
    </div>
  );
}
