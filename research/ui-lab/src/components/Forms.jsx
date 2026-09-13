import { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "../icons.jsx";

// ---- Form controls -----------------------------------------------------------
export function FormControls() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("auto");
  const [slider, setSlider] = useState(60);
  return (
    <div className="form">
      <label className="form-field">
        <span className="form-label">项目名称</span>
        <input className="form-input" defaultValue="my-ai-agent" />
      </label>
      <label className="form-field">
        <span className="form-label">运行环境</span>
        <button className="form-input form-select" type="button">
          <span>本地工作区</span>
          <ChevronDownIcon size={16} />
        </button>
      </label>
      <label className="form-field">
        <span className="form-label">
          推理强度 <span className="form-value">{slider}%</span>
        </span>
        <input
          type="range"
          className="form-slider"
          value={slider}
          onChange={(e) => setSlider(e.target.value)}
        />
      </label>
      <label className="form-check" onClick={() => setChecked(!checked)}>
        <span className={`checkbox ${checked ? "on" : ""}`}>
          {checked && "✓"}
        </span>
        <span>允许 Agent 自动执行安全命令</span>
      </label>
      <div className="form-field">
        <span className="form-label">沙箱级别</span>
        <div className="demo-row" style={{ gap: 16 }}>
          {["strict", "auto", "off"].map((v) => (
            <label key={v} className="form-check" onClick={() => setRadio(v)}>
              <span className={`radio ${radio === v ? "on" : ""}`} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Emoji picker --------------------------------------------------------------
const EMOJIS = ["😀","😄","😂","🤣","😊","😍","🤔","😅","😭","😴","🤯","😎","🥳","😤","🙃","😇","👍","👎","👏","🙏","💪","🤝","✌️","🫡","🔥","✨","🎉","💯","⭐","⚡","🚀","🎯"];

export function EmojiPicker() {
  const [picked, setPicked] = useState("🚀");
  return (
    <div className="emoji-panel">
      <div className="emoji-search">
        <SearchIcon size={14} />
        <input placeholder="搜索表情" />
      </div>
      <div className="emoji-grid">
        {EMOJIS.map((e) => (
          <button
            key={e}
            className={`emoji-cell ${e === picked ? "active" : ""}`}
            onClick={() => setPicked(e)}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Date picker ---------------------------------------------------------------
const WEEK = ["一", "二", "三", "四", "五", "六", "日"];

export function DatePickerPanel() {
  const [day, setDay] = useState(13);
  // 2026-09: 1st is Tuesday -> offset 1 (Monday-first grid)
  const cells = [null, ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <div className="date-panel">
      <div className="date-header">
        <button className="icon-btn icon-btn-sm">‹</button>
        <span className="date-title">2026 年 9 月</span>
        <button className="icon-btn icon-btn-sm">›</button>
      </div>
      <div className="date-grid">
        {WEEK.map((w) => (
          <span key={w} className="date-week">{w}</span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`x${i}`} />
          ) : (
            <button
              key={d}
              className={`date-cell ${d === day ? "active" : ""} ${d === 13 ? "today" : ""}`}
              onClick={() => setDay(d)}
            >
              {d}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
