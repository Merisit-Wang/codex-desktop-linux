import { useState } from "react";

// ---- Composer mode toggle ---------------------------------------------------
// Upstream: sliding indicator with 0.5px border + shadow, selected bg token.
const MODES = ["聊天", "代理", "计划"];

export function ModeToggle() {
  const [active, setActive] = useState(1);
  return (
    <div className="mode-toggle" role="tablist">
      {MODES.map((m, i) => (
        <button
          key={m}
          role="tab"
          aria-selected={i === active}
          className={`mode-toggle-item ${i === active ? "active" : ""}`}
          onClick={() => setActive(i)}
        >
          {m}
        </button>
      ))}
      <span
        className="mode-toggle-indicator"
        style={{ transform: `translateX(${active * 100}%)` }}
      />
    </div>
  );
}

// ---- Terminal panel -----------------------------------------------------------
// Upstream xterm panel: bg maps to surface token, ANSI accents from palette.
export function TerminalPanel() {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-dot" style={{ background: "#ff5f57" }} />
        <span className="terminal-dot" style={{ background: "#febc2e" }} />
        <span className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="terminal-title">zsh — codex-desktop-linux</span>
      </div>
      <div className="terminal-body">
        <div className="term-line">
          <span className="term-prompt">$</span>
          <span className="term-cmd">npm run test</span>
        </div>
        <div className="term-line term-dim">{""}</div>
        <div className="term-line"> ✓ src/components/Agent.test.jsx (3 tests) 12ms</div>
        <div className="term-line term-green"> ✓ tokens resolve in both themes</div>
        <div className="term-line term-yellow"> ⚠ chunk size 244KB exceeds budget</div>
        <div className="term-line term-dim">{""}</div>
        <div className="term-line">
          <span className="term-dim">Test Files </span>
          <span className="term-green">1 passed</span>
          <span className="term-dim"> (1)</span>
        </div>
        <div className="term-line">
          <span className="term-prompt">$</span>
          <span className="term-cursor" />
        </div>
      </div>
    </div>
  );
}

// ---- Diff card --------------------------------------------------------------
const DIFF_LINES = [
  { type: "hunk", text: "@@ -10,6 +10,9 @@ export function App() {" },
  { type: "ctx", text: "  const [theme, setTheme] = useTheme();" },
  { type: "del", text: "  const mode = \"chat\";" },
  { type: "add", text: "  const [mode, setMode] = useState(\"agent\");" },
  { type: "add", text: "  const modes = [\"chat\", \"agent\", \"plan\"];" },
  { type: "ctx", text: "  const selected = registry.find(c => c.id === id);" },
];

export function DiffCard() {
  return (
    <div className="diffcard">
      <div className="diffcard-header">
        <span className="diffcard-path">src/App.jsx</span>
        <span className="diffcard-stats">
          <span className="diff-add">+3</span>
          <span className="diff-del">−1</span>
        </span>
      </div>
      <div className="diffcard-body">
        {DIFF_LINES.map((l, i) => (
          <div key={i} className={`diff-line diff-${l.type}`}>
            <span className="diff-gutter">
              {l.type === "add" ? "+" : l.type === "del" ? "−" : ""}
            </span>
            <span className="diff-text">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
