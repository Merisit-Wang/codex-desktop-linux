import { Sidebar } from "./Sidebar.jsx";
import { Composer } from "./Buttons.jsx";
import { UserMessage, AssistantMessage } from "./Messages.jsx";
import { ModelPill } from "./Misc.jsx";
import { AccountMenu } from "./Social.jsx";
import { CodeBlock } from "./CodeBlock.jsx";
import { SourcesDemo } from "./Social.jsx";
import { PlusIcon } from "../icons.jsx";

// Capstone: assemble the reproduced components into a full chat window,
// validating that the token system composes across components.
export function ChatPage() {
  return (
    <div className="chatpage">
      <Sidebar />
      <div className="chatpage-main">
        <header className="chatpage-header">
          <ModelPill />
          <div className="composer-spacer" />
          <button className="icon-btn" aria-label="新任务">
            <PlusIcon />
          </button>
          <AccountMenu open={false} />
        </header>
        <div className="chatpage-scroll">
          <div className="chat-surface">
            <UserMessage>
              帮我在 ui-lab 里加一个代码块组件，要求有语言栏和复制按钮
            </UserMessage>
            <AssistantMessage showActions={false}>
              <p>好的，组件结构如下——头部是语言名和复制操作，语法色直接取调色板令牌：</p>
            </AssistantMessage>
            <div style={{ padding: "0 0 4px" }}>
              <CodeBlock />
            </div>
            <AssistantMessage>
              <p>
                表面的灰色用了 <code>--gray-50</code>，亮暗主题下分别解析为{" "}
                <code>#f9f9f9</code> 和 <code>#131313</code>，不用写任何主题分支。
              </p>
            </AssistantMessage>
            <SourcesDemo />
          </div>
        </div>
        <footer className="chatpage-footer">
          <Composer />
        </footer>
      </div>
    </div>
  );
}
