import { useEffect, useState } from "react";
import { GearIcon, LogoutIcon, SparkleIcon, GlobeIcon } from "../icons.jsx";

// ---- Account menu ----------------------------------------------------------
export function AccountMenu() {
  return (
    <div className="account-wrap">
      <button className="avatar-btn" aria-label="账户菜单">
        <span className="avatar-circle">M</span>
        <span className="avatar-badge" />
      </button>
      <div className="menu-panel account-panel">
        <div className="account-head">
          <span className="avatar-circle avatar-lg">M</span>
          <div>
            <div className="menu-item-title">Merisit Wang</div>
            <div className="menu-item-desc">merisit-wang@hotmail.com</div>
          </div>
        </div>
        <div className="menu-sep" />
        <div className="menu-item">
          <SparkleIcon size={16} />
          <span className="menu-item-title">升级套餐</span>
        </div>
        <div className="menu-item">
          <GearIcon size={16} />
          <span className="menu-item-title">设置</span>
        </div>
        <div className="menu-sep" />
        <div className="menu-item menu-item-danger">
          <LogoutIcon size={16} />
          <span className="menu-item-title">退出登录</span>
        </div>
      </div>
    </div>
  );
}

// ---- Streaming answer -------------------------------------------------------
const FULL_TEXT =
  "令牌系统最大的价值，是让「交互态」不再是散落的魔法数字：hover、active、禁用都从前景色按固定百分比混合而来，任何组件换肤只需要换令牌。";

export function StreamingDemo() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setN((prev) => (prev >= FULL_TEXT.length + 30 ? 0 : prev + 1));
    }, 60);
    return () => clearInterval(timer);
  }, []);
  const done = n >= FULL_TEXT.length;
  return (
    <div className="msg-assistant" style={{ maxWidth: "34rem" }}>
      <div className="msg-text">
        {FULL_TEXT.slice(0, Math.min(n, FULL_TEXT.length))}
        {!done && <span className="stream-cursor" aria-hidden="true" />}
      </div>
    </div>
  );
}

// ---- Skeleton (from upstream profile chunk: steps(48) sweep) ---------------
export function SkeletonDemo() {
  return (
    <div className="demo-col" style={{ width: "20rem" }}>
      <div className="skeleton" style={{ height: 18, width: "60%" }} />
      <div className="skeleton" style={{ height: 14, width: "100%" }} />
      <div className="skeleton" style={{ height: 14, width: "85%" }} />
    </div>
  );
}

// ---- Sources / citations -----------------------------------------------------
const SOURCES = [
  { site: "developer.mozilla.org", title: "color-mix() - CSS: Cascading Style Sheets", letter: "M" },
  { site: "tailwindcss.com", title: "Theme variables - Tailwind CSS v4", letter: "T" },
  { site: "lightningcss.dev", title: "Lightning CSS — Transforms", letter: "L" },
];

export function SourcesDemo() {
  return (
    <div className="sources-wrap">
      <p className="msg-text" style={{ margin: "0 0 12px" }}>
        color-mix() 允许在指定色彩空间中混合两种颜色
        <button className="cite">1</button>
        ，Tailwind v4 的主题变量则全部以 CSS 自定义属性形式输出
        <button className="cite">2</button>。
      </p>
      <div className="sources-row">
        {SOURCES.map((s) => (
          <a key={s.site} className="source-card" href="#" onClick={(e) => e.preventDefault()}>
            <div className="source-site">
              <span className="source-favicon">{s.letter}</span>
              <span className="source-domain">{s.site}</span>
            </div>
            <div className="source-title">{s.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export { GlobeIcon };
