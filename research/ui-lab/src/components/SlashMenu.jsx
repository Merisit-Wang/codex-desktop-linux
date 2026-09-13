import {
  ArchiveIcon, ChatIcon, ForkIcon, FileIcon, PuzzleIcon, ChevronRightIcon,
  EditIcon, SparkleIcon, PinIcon, PanelRightIcon, DotsIcon, PlusIcon,
  CopyIcon, SearchIcon, MicIcon,
} from "../icons.jsx";

// Slash command menu measured from live app (typed "/" in composer):
// panel w=736 h=320, radius 20px, 1px border, rows h=29, icon+name+desc,
// 30px section gap before skills, trailing System/Personal badges.
const COMMANDS = [
  { icon: ArchiveIcon, name: "Archive", desc: "Archive the current chat" },
  { icon: CopyIcon, name: "Compact", desc: "Compact this chat's context" },
  { icon: ChatIcon, name: "Feedback", desc: "Send feedback about this chat" },
  { icon: ForkIcon, name: "Fork chat", desc: "Fork this chat" },
  { icon: PlusIcon, name: "Goal", desc: "Set a goal to keep pursuing" },
  { icon: FileIcon, name: "Init", desc: "Create an AGENTS.md file with instructions for Codex" },
  { icon: PuzzleIcon, name: "MCP", desc: "Show MCP server status" },
  { icon: ChevronRightIcon, name: "Model", desc: "", submenu: true },
  { icon: EditIcon, name: "New chat", desc: "Start a blank chat in the same workspace" },
  { icon: SparkleIcon, name: "Pet", desc: "Wake or tuck away the desktop pet" },
  { icon: PinIcon, name: "Pin chat", desc: "Keep this chat in the sidebar" },
  { icon: FileIcon, name: "Plan mode", desc: "Turn plan mode on" },
  { icon: SparkleIcon, name: "Reasoning", desc: "High", submenu: true },
  { icon: EditIcon, name: "Rename", desc: "Rename the current chat" },
  { icon: PanelRightIcon, name: "Side", desc: "Start a temporary side chat" },
  { icon: EditIcon, name: "Sketch", desc: "Draw a sketch" },
  { icon: DotsIcon, name: "Status", desc: "Show chat ID, context usage, and rate limits" },
];

const SKILLS = [
  { name: "Image Gen", desc: "Generate or edit images for websites, games, and more", badge: "System" },
  { name: "OpenAI Docs", desc: "OpenAI and Codex docs for models, skills, tasks, and setup", badge: "System" },
  { name: "Plugin Creator", desc: "Scaffold plugins and marketplace entries", badge: "System" },
  { name: "Review Agent", desc: "Find actionable bugs in code changes", badge: "System" },
  { name: "Skill Creator", desc: "Create or update a skill", badge: "System" },
  { name: "Skill Installer", desc: "Install curated skills from openai/skills or other repos", badge: "System" },
  { name: "Visualize", desc: "Turn ideas and data into interactive visuals", badge: "Personal" },
];

function Row({ icon: IconC, name, desc, badge, submenu, active }) {
  return (
    <button className={`slash-row ${active ? "active" : ""}`}>
      <IconC size={15} className="slash-icon" />
      <span className="slash-name">{name}</span>
      {desc && <span className="slash-desc">{desc}</span>}
      {badge && <span className="slash-badge">{badge}</span>}
      {submenu && <ChevronRightIcon size={14} className="slash-sub" />}
    </button>
  );
}

export function SlashMenu() {
  return (
    <div className="slash-panel">
      <div className="slash-scroll">
        {COMMANDS.map((c, i) => (
          <Row key={c.name} {...c} active={i === 1} />
        ))}
        <div className="slash-section">Skills</div>
        {SKILLS.map((s) => (
          <Row key={s.name} icon={SparkleIcon} {...s} />
        ))}
      </div>
    </div>
  );
}
