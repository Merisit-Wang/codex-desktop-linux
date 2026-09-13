import { CopyIcon } from "../icons.jsx";

// Code block reproduced in the upstream style: tinted surface, header row
// with language label + copy action, syntax colors derived from the palette
// tokens (blue/green/orange/purple/red/gray scale).
export function CodeBlock() {
  return (
    <figure className="codeblock">
      <figcaption className="codeblock-header">
        <span className="codeblock-lang">jsx</span>
        <button className="codeblock-copy">
          <CopyIcon size={14} />
          <span>复制代码</span>
        </button>
      </figcaption>
      <pre className="codeblock-body">
        <code>
          <span className="tok-k">export function</span>{" "}
          <span className="tok-f">Button</span>({"{ variant }"}) {"{\n"}
          {"  "}<span className="tok-k">return</span>{" "}
          <span className="tok-p">&lt;button</span>{" "}
          <span className="tok-a">className</span>=
          <span className="tok-s">{'{`btn btn-${variant}`}'}</span>
          <span className="tok-p">/&gt;</span>;{"\n"}
          {"}"}{"\n"}
          <span className="tok-c">{"// 令牌驱动的样式，自动适配明暗主题"}</span>
        </code>
      </pre>
    </figure>
  );
}

export function InlineCodeDemo() {
  return (
    <p className="msg-text" style={{ maxWidth: "34rem", margin: 0 }}>
      正文中的行内代码如 <code>color-mix()</code> 使用{" "}
      <code>var(--spacing)</code> 级别的圆角与次级背景，与段落文字保持同一基线。
    </p>
  );
}
