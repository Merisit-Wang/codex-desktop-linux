import { ArrowUpIcon, PaperclipIcon, MicIcon } from "../icons.jsx";

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
export function Composer() {
  return (
    <div className="composer">
      <textarea
        className="composer-input"
        rows={1}
        placeholder="询问任何问题"
      />
      <div className="composer-bar">
        <button className="icon-btn" aria-label="附件">
          <PaperclipIcon />
        </button>
        <div className="composer-spacer" />
        <button className="icon-btn" aria-label="语音输入">
          <MicIcon />
        </button>
        <button className="icon-btn icon-btn-solid" aria-label="发送">
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
}
