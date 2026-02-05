---
title: "OpenClaw 技术文档"
date: "2026-02-06"
description: "OpenClaw 的架构、核心概念、插件系统及使用指南"
---

# OpenClaw 技术文档

## 1. 项目概述
OpenClaw 是一个 **开源的 AI 代理平台**，旨在为个人和团队提供可扩展、可组合的 AI 助手。它兼容多种大模型（Claude、Gemini、OpenAI 等），并通过 **Skill** 插件体系实现功能模块化。

## 2. 核心架构
- **Gateway Daemon**：统一入口，负责会话路由、模型调用、任务调度。支持插件化的 **cron**、**webhook**、**agent** 等。
- **Agent Runtime**：运行用户指令的沙箱环境，提供 `exec`, `browser`, `nodes` 等工具。
- **Skill 系统**：每个功能（如 `apple-notes`, `things-mac`, `coding-agent`）都有独立的 **Skill** 目录，包含 `SKILL.md` 描述与实现脚本。
- **Memory**：持久化的 `MEMORY.md` 与 `memory/YYYY-MM-DD.md` 用于记录长期和每日日志。

## 3. 插件（Skill）开发指南
1. 在 `skills/` 目录下创建子目录并编写 `SKILL.md`。
2. 使用 **Node.js** 编写 `index.js`，导出符合 OpenClaw CLI 的命令。
3. 在 `package.json` 中添加 `clawdhub` 配置，以便通过 `clawdhub` 发布。
4. 本地调试可使用 `openclaw skill:test <skill-name>`。

## 4. 常用 CLI 命令
```bash
# 启动网关
openclaw gateway start

# 查看状态
openclaw status

# 运行技能
openclaw skill:run apple-notes "Add note 'Demo'"

# 管理 cron 任务
openclaw cron add --job '{...}'
```

## 5. 部署与 CI/CD
- 使用 **GitHub Actions** 自动构建并发布 Docker 镜像。
- 示例 workflow 在 `.github/workflows/deploy.yml` 中。
- 可通过 `docker run -e OPENCLAW_CONFIG=...` 部署到服务器。

## 6. 常见问题（FAQ）
1. **如何更新模型？** 修改 `config.yaml` 中的 `model` 字段并重启网关。
2. **Skill 安装报错 missing binary?** 确认系统已安装依赖（`brew install <binary>`），或在 `Skill` 的 `metadata.requires` 中声明。
3. **内存泄漏怎么办？** 使用 `openclaw memory:compact` 清理临时文件。

---
> 本文档基于 OpenClaw 最新版本（v0.9.3），如有更新请同步至此文件。
