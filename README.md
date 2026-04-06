# Golover's Blog

一个基于 [Astro](https://astro.build) 的个人博客，当前部署在 GitHub Pages：

- 线上地址：[https://golove.github.io/](https://golove.github.io/)
- 仓库地址：[https://github.com/golove/golove.github.io](https://github.com/golove/golove.github.io)

这个项目最初基于 Fuwari 模板搭建，后续已经按个人博客的使用方式做了持续定制和内容整理。

## 当前内容方向

博客目前主要记录这些内容：

- `Swift`、`Rust`、`JavaScript` 等语言学习笔记
- 工具使用、开发实践和阶段性总结
- 热点追踪类内容，例如 AI 工具、GitHub 热门项目观察

## 技术栈

- Astro 5
- Tailwind CSS
- Svelte
- Pagefind
- Expressive Code
- KaTeX
- GitHub Pages
- GitHub Actions

## 本地开发

先安装依赖：

```bash
pnpm install
```

常用命令：

```bash
pnpm dev
pnpm check
pnpm build
pnpm preview
```

如果要新建一篇文章，可以使用：

```bash
pnpm new-post my-post
```

文章内容位于 [src/content/posts](/Users/golove/Documents/golove.github.io/src/content/posts)，站点主要配置位于 [src/config.ts](/Users/golove/Documents/golove.github.io/src/config.ts) 和 [astro.config.mjs](/Users/golove/Documents/golove.github.io/astro.config.mjs)。

## 自动化发布

仓库当前有两条主要 GitHub Actions 工作流：

- [deploy.yml](/Users/golove/Documents/golove.github.io/.github/workflows/deploy.yml)
  负责在 `main` 分支更新后构建站点并发布到 GitHub Pages。
- [github-trending-post.yml](/Users/golove/Documents/golove.github.io/.github/workflows/github-trending-post.yml)
  负责定时抓取 GitHub Trending，生成“GitHub 热门项目观察”文章，并在检查和构建通过后自动提交到 `main`。

自动文章生成脚本位于 [github-trending-post.mjs](/Users/golove/Documents/golove.github.io/scripts/github-trending-post.mjs)。

这套自动任务默认每天运行一次，但脚本会自行判断距离上一篇 Trending 文章是否已满 3 天；只有满足条件时才会真正生成新文章。这样既能保持稳定调度，也能避免重复发文。

## 文章 Frontmatter

当前文章使用的基础 frontmatter 结构大致如下：

```yaml
---
title: "文章标题"
published: 2026-04-06
description: "文章摘要"
tags: ["标签1", "标签2"]
category: 热点追踪
draft: false
---
```

## 部署说明

博客当前使用 GitHub Pages 部署，不依赖本地常驻进程。只要代码推送到 `main`，GitHub Actions 就会负责后续构建和发布。

这也意味着：

- 你关闭本地电脑或 Codex，不影响线上博客运行
- 定时生成文章的任务会在 GitHub 上自行执行
- 构建失败时不会自动推送有问题的内容

## License

代码部分沿用仓库现有 MIT License，博客文章内容默认以站点页脚声明为准。
