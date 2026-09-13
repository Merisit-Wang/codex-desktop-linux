import { CopyIcon, RetryIcon, ThumbsUpIcon, EditIcon } from "../icons.jsx";

export function UserMessage({ children }) {
  return (
    <div className="msg-row msg-row-user">
      <div className="msg-bubble">{children}</div>
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
            <button className="icon-btn icon-btn-sm" aria-label="复制">
              <CopyIcon size={16} />
            </button>
            <button className="icon-btn icon-btn-sm" aria-label="赞">
              <ThumbsUpIcon size={16} />
            </button>
            <button className="icon-btn icon-btn-sm" aria-label="重试">
              <RetryIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
          的灰色，而是 <code>color-mix(in oklab, 前景色 8%, transparent)</code>，
          这样在明暗主题下都能自动得到协调的层次。
        </p>
      </AssistantMessage>
      <UserMessage>那它和 rgba() 有什么区别？</UserMessage>
      <AssistantMessage>
        <p>
          rgba() 在 sRGB 空间做简单透明叠加，而 color-mix 可以选择感知均匀的
          oklab/oklch 空间，混合结果在不同亮度下更自然。
        </p>
      </AssistantMessage>
    </div>
  );
}

export { EditIcon };
