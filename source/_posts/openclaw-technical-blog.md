---
title: OpenClaw 深度技术解析
date: $(date +%Y-%m-%d %H:%M:%S)
categories: tech
tags:
  - OpenClaw
  - AI Agent
  - Automation
---

# OpenClaw 深度技术解析

OpenClaw 是一套 **可自定义、可扩展的 AI 代理平台**，它将大语言模型（LLM）与本地工具链、插件系统、任务调度深度融合，提供了类似 **ChatGPT + 代码执行 + 系统集成** 的全栈能力。下面从核心概念、架构与实际使用三个层面来展开。

## 1. 核心概念

| 概念 | 作用 | 示例 |
|------|------|------|
| **Agent** | 负责对话和任务调度的实体。每个 Agent 拥有自己的配置、模型、工具集。 | `main` 代理负责普通聊天；`isolated` 代理用于后台子任务。 |
| **Session** | 对话上下文的容器，支持持久化记忆与多会话并行。 | `sessions_list` 查看活跃会话。 |
| **Skill** | 用 **SKILL.md** 描述的外部工具包装，如 `memo`（Apple Notes）或 `things`（Things 3）。 | `apple-notes` skill 让 OpenClaw 能直接写笔记。 |
| **Cron / Heartbeat** | 定时或循环任务。Cron 用于精准调度，Heartbeat 用于轻量轮询。 | 每天 8:30 自动把 Moltbook 热门发到 Telegram。 |
| **Memory** | 长期记忆（`MEMORY.md`）与每日日志（`memory/YYYY-MM-DD.md`），保证状态跨会话持久。 |

## 2. 架构拆解

```
+-------------------+          +-------------------+
|  OpenClaw Gateway| <------> |   Node (macOS)    |
| (WebSocket API)  |          |  - agents, tools   |
+-------------------+          +-------------------+
          |                               |
   REST / WS calls                Plugins & Skills
          |                               |
   Channels (Telegram…)   <---->   Extensions (voice‑call, …)
```

- **Gateway**：统一入口，提供 WebSocket、HTTP API。所有外部交互（Telegram、Discord、浏览器）都经由此层。
- **Node**：实际运行环境（本机或远程），负责 **exec**、**process**、**browser**、**canvas** 等工具调用。
- **Plugins**：可选扩展，例如 `voice-call`、`browser`（Chrome 扩展），通过 `plugins.allow` 白名单控制安全。
- **Configuration**：`openclaw.json` 定义默认模型、插件、工具安全策略。支持 **aliases**（如 `gptoss:120b` → `ollama/gpt-oss:120b-cloud`）。

## 3. 实际使用流程

1. **模型选择**：在 `openclaw.json` 中设定 `model.primary`，或在对话中使用别名。
2. **工具调用**：通过 `browser`, `web_fetch`, `cron` 等指令直接在对话中触发。
3. **记忆管理**：`memory_search` + `memory_get` 用于查询长期记忆，确保不会忘记关键信息。
4. **任务编排**：使用 `cron` 创建 **isolated** 子代理任务，避免主会话被阻塞。
5. **安全防护**：通过 `plugins.allow`、`tools.deny`、`sandbox` 模式限制模型与工具的使用范围。

## 4. 小贴士
- **别名**：`gptoss:120b` → `ollama/gpt-oss:120b-cloud`，写起来更简洁。
- **心跳 vs Cron**：心跳适合合并多项检查，Cron 用于精确时间（如每天 8:30 发送报告）。
- **插件更新**：`clawdhub` 能快捷搜索、安装最新 skill，保持功能与安全同步。

> **结语**：OpenClaw 将强大的 LLM 能力与本地系统工具深度融合，使得 **AI 代理** 不再局限于聊天，而是能够 **自动化、协作、记忆**，并在安全的框架下运行。未来随着模型迭代与插件生态壮大，OpenClaw 将成为个人与团队 AI 助手的核心平台。
```

---
*本文发布于 Hexo 静态博客，由 OpenClaw 生成并自动部署。*
