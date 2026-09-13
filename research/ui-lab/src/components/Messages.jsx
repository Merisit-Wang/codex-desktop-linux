import { CopyIcon, RetryIcon, ThumbsUpIcon, EditIcon, ForkIcon, ChevronDownIcon } from "../icons.jsx";

export function UserMessage({ children }) {
  return (
    <div className="msg-row msg-row-user">
      <div className="msg-bubble">{children}</div>
    </div>
  );
}

// Agent flavor (measured from live app): user message hover actions are
// "Copy message" / "Edit message"; assistant actions are "Copy" /
// "Fork chat from here" — NOT consumer thumbs/retry.
export function UserMessageAgent({ children }) {
  return (
    <div className="msg-row msg-row-user msg-agent">
      <div className="msg-bubble">{children}</div>
      <div className="msg-actions msg-actions-user">
        <button className="icon-btn icon-btn-sm" aria-label="Copy message"><CopyIcon size={15} /></button>
        <button className="icon-btn icon-btn-sm" aria-label="Edit message"><EditIcon size={15} /></button>
      </div>
    </div>
  );
}

export function AssistantMessage({ children, showActions = true }) {
  return (
    <div className="msg-row">
      <div className="msg-assistant">
        <div className="msg-text">{children}</div>
        {showActions && (
          <div className="msg-actions">
            <button className="icon-btn icon-btn-sm" aria-label="复制"><CopyIcon size={16} /></button>
            <button className="icon-btn icon-btn-sm" aria-label="赞"><ThumbsUpIcon size={16} /></button>
            <button className="icon-btn icon-btn-sm" aria-label="重试"><RetryIcon size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AssistantMessageAgent({ children }) {
  return (
    <div className="msg-row">
      <div className="msg-assistant">
        <div className="msg-text">{children}</div>
        <div className="msg-actions">
          <button className="icon-btn icon-btn-sm" aria-label="Copy"><CopyIcon size={15} /></button>
          <button className="icon-btn icon-btn-sm" aria-label="Fork chat from here"><ForkIcon size={15} /></button>
        </div>
      </div>
    </div>
  );
}

// Agent work-log row: collapsible "Worked for 3m 14s" (x=729 full column).
export function WorkLogRow({ duration = "3m 14s", steps = 7 }) {
  return (
    <button className="worklog-row">
      <ChevronDownIcon size={14} className="worklog-chevron" />
      <span className="worklog-label">Worked for {duration}</span>
      <span className="worklog-steps">{steps} steps</span>
    </button>
  );
}

// Changed-files review bar: "Review changed files" + Undo / Review.
export function ReviewBar({ files = 2 }) {
  return (
    <div className="review-bar">
      <button className="review-files">
        <ChevronDownIcon size={14} />
        <span>Review changed files</span>
        <span className="review-count">{files}</span>
      </button>
      <div className="composer-spacer" />
      <button className="btn btn-secondary review-btn">Undo</button>
      <button className="btn btn-primary review-btn">Review</button>
    </div>
  );
}

// Consumer-style demo (ChatGPT flavor)
export function MessagesDemo() {
  return (
    <div className="chat-surface">
      <UserMessage>帮我解释一下 CSS 里的 color-mix() 是怎么工作的？</UserMessage>
      <AssistantMessage>
        <p>
          <code>color-mix(in oklab, A x%, transparent)</code> 会把颜色 A 与透明色按
          比例混合，在 oklab 色彩空间中插值，从而得到感知上均匀的半透明色。
        </p>
        <p>
          上游的设计 token 大量使用了这个技巧：例如按钮的 hover 背景不是写死
          的灰色，而是 <code>color-mix(in oklab, 前景色 8%, transparent)</code>。
        </p>
      </AssistantMessage>
    </div>
  );
}

// Agent-style demo (Codex flavor, live-measured)
export function AgentMessagesDemo() {
  return (
    <div className="chat-surface">
      <UserMessageAgent>帮我解决这个问题：docker pull 一直超时</UserMessageAgent>
      <WorkLogRow duration="3m 14s" steps={7} />
      <AssistantMessageAgent>
        <p>
          根因已经定位清楚了：主机通过终端代理能访问 Docker Hub，但 daemon
          默认启动环境没有继承代理变量。改动如下：
        </p>
      </AssistantMessageAgent>
      <ReviewBar files={2} />
    </div>
  );
}
