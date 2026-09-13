import { useState } from "react";
import { ChevronDownIcon } from "../icons.jsx";

// Model picker pill + dropdown panel, reproduced layout only.
export function ModelPill({ open: initialOpen = false }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="model-pill-wrap">
      <button
        className={`model-pill ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className="model-pill-name">GPT-5</span>
        <span className="model-pill-tag">Thinking</span>
        <ChevronDownIcon size={16} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className="menu-panel">
          <div className="menu-item">
            <div>
              <div className="menu-item-title">Instant</div>
              <div className="menu-item-desc">回答更快</div>
            </div>
          </div>
          <div className="menu-item active">
            <div>
              <div className="menu-item-title">Thinking</div>
              <div className="menu-item-desc">思考更久，回答更好</div>
            </div>
            <span className="menu-check">✓</span>
          </div>
          <div className="menu-sep" />
          <div className="menu-item">
            <div>
              <div className="menu-item-title">Pro</div>
              <div className="menu-item-desc">研究级智能</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TooltipDemo() {
  return (
    <div className="demo-row" style={{ padding: "24px 0" }}>
      <span className="tooltip-anchor">
        <button className="icon-btn">
          <ChevronDownIcon size={0} style={{ display: "none" }} />
          悬停我
        </button>
        <span className="tooltip">这是一段提示</span>
      </span>
    </div>
  );
}

export function ShimmerDemo() {
  return (
    <div className="demo-col">
      <p className="shimmer-text">正在思考…</p>
      <p className="shimmer-text shimmer-slow">Searching the web</p>
    </div>
  );
}
