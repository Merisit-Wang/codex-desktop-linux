import { useState } from "react";

// ---- Toggle switch -------------------------------------------------------
export function Toggle({ defaultOn = false, label }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button
        role="switch"
        aria-checked={on}
        className={`toggle ${on ? "on" : ""}`}
        onClick={() => setOn(!on)}
      >
        <span className="toggle-knob" />
      </button>
    </label>
  );
}

// ---- Settings dialog -----------------------------------------------------
export function SettingsDialog() {
  return (
    <div className="overlay">
      <div className="dialog">
        <header className="dialog-header">
          <h3 className="dialog-title">设置</h3>
          <button className="icon-btn icon-btn-sm" aria-label="关闭">
            ✕
          </button>
        </header>
        <div className="dialog-body">
          <div className="dialog-section">通用</div>
          <Toggle label="跟随系统主题" defaultOn />
          <Toggle label="流式输出动画" defaultOn />
          <Toggle label="发送快捷键提示" />
          <div className="dialog-section">通知</div>
          <Toggle label="任务完成时提醒我" defaultOn />
        </div>
      </div>
    </div>
  );
}

// ---- Toast ---------------------------------------------------------------
export function ToastDemo() {
  return (
    <div className="demo-col" style={{ alignItems: "center", gap: 12 }}>
      <div className="toast">
        <span>已复制到剪贴板</span>
      </div>
      <div className="toast">
        <span>对话已删除</span>
        <button className="toast-action">撤销</button>
      </div>
    </div>
  );
}
