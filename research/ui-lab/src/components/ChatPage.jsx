import { Sidebar } from "./Sidebar.jsx";
import { Composer } from "./Buttons.jsx";
import { UserMessageAgent, WorkLogRow, AssistantMessageAgent, ReviewBar } from "./Messages.jsx";
import { AccountMenu } from "./Social.jsx";
import { CodeBlock } from "./CodeBlock.jsx";
import { DotsIcon, PinIcon, PanelRightIcon } from "../icons.jsx";

// Capstone: assemble the reproduced components into a full chat window,
// validating that the token system composes across components.
// Header measured from live app: centered conversation title; right side
// 28px icon buttons (chat actions / pinned summary / side panel). The model
// pill is NOT in the header in the agent flavor — it lives in the composer.
export function ChatPage() {
  return (
    <div className="chatpage">
      <Sidebar />
      <div className="chatpage-main">
        <header className="chatpage-header">
          <div className="chatpage-title-wrap">
            <button className="chatpage-title">docker pull stirling-pdf 报错排查</button>
          </div>
          <div className="chatpage-header-actions">
            <button className="icon-btn icon-btn-sm" aria-label="Chat actions"><DotsIcon size={16} /></button>
            <button className="icon-btn icon-btn-sm" aria-label="Toggle pinned summary"><PinIcon size={15} /></button>
            <button className="icon-btn icon-btn-sm" aria-label="Toggle side panel"><PanelRightIcon size={15} /></button>
            <AccountMenu open={false} />
          </div>
        </header>
        <div className="chatpage-scroll">
          <div className="chat-surface">
            <UserMessageAgent>
              帮我解决这个问题：docker pull 一直超时
            </UserMessageAgent>
            <WorkLogRow duration="3m 14s" steps={7} />
            <AssistantMessageAgent>
              <p>
                根因已经定位清楚了：daemon 默认启动环境没有继承代理变量。
                我改了两处配置：
              </p>
            </AssistantMessageAgent>
            <div style={{ padding: "0 0 4px" }}>
              <CodeBlock />
            </div>
            <ReviewBar files={2} />
          </div>
        </div>
        <footer className="chatpage-footer">
          <Composer />
        </footer>
      </div>
    </div>
  );
}

