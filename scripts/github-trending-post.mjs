import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT_DIR, "src", "content", "posts");
const DAY_MS = 24 * 60 * 60 * 1000;
const API_VERSION = "2022-11-28";
const USER_AGENT = "golove-github-trending-bot";

const args = new Set(process.argv.slice(2));
const force = args.has("--force") || process.env.FORCE_GENERATE === "true";
const dryRun = args.has("--dry-run") || process.env.DRY_RUN === "true";

function formatDateParts(date = new Date()) {
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Shanghai",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const parts = formatter.formatToParts(date);
	const year = parts.find((part) => part.type === "year")?.value ?? "1970";
	const month = parts.find((part) => part.type === "month")?.value ?? "01";
	const day = parts.find((part) => part.type === "day")?.value ?? "01";
	return {
		iso: `${year}-${month}-${day}`,
		zh: `${year}年${month}月${day}日`,
	};
}

function parseIsoDate(isoDate) {
	const [year, month, day] = isoDate.split("-").map(Number);
	return Date.UTC(year, month - 1, day);
}

async function listExistingTrendingPosts() {
	const files = await readdir(POSTS_DIR);
	return files
		.map((file) => {
			const match = file.match(/^github-trending-(\d{4}-\d{2}-\d{2})\.md$/);
			if (!match) return null;
			return { file, date: match[1] };
		})
		.filter(Boolean)
		.sort((a, b) => a.date.localeCompare(b.date));
}

function decodeHtmlEntities(value) {
	return value
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&#x2F;/g, "/")
		.replace(/&nbsp;/g, " ");
}

function stripHtml(value) {
	return decodeHtmlEntities(value.replace(/<[^>]+>/g, " "))
		.replace(/\s+/g, " ")
		.trim();
}

function stripMarkdown(value) {
	return value
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/!\[[^\]]*]\([^)]+\)/g, " ")
		.replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[*_~>#-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function uniq(items) {
	return [...new Set(items.filter(Boolean))];
}

function parseTrendingRepositories(html) {
	const articles = [...html.matchAll(/<article class="Box-row">([\s\S]*?)<\/article>/g)];
	const repositories = [];

	for (const articleMatch of articles) {
		const article = articleMatch[1];
		const repoMatch = article.match(/<h2[\s\S]*?href="\/([^"/]+\/[^"/]+)"/);
		if (!repoMatch) continue;

		const descriptionMatch = article.match(/<p class="col-9 color-fg-muted my-1 tmp-pr-4">\s*([\s\S]*?)\s*<\/p>/);
		const starsTodayMatch = article.match(/([\d,]+)\s+stars today/);

		repositories.push({
			path: repoMatch[1],
			trendingDescription: descriptionMatch ? stripHtml(descriptionMatch[1]) : "",
			starsToday: starsTodayMatch ? starsTodayMatch[1] : "",
		});

		if (repositories.length === 5) break;
	}

	return repositories;
}

async function request(url, { accept = "application/vnd.github+json" } = {}) {
	const headers = {
		Accept: accept,
		"User-Agent": USER_AGENT,
		"X-GitHub-Api-Version": API_VERSION,
	};

	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}

	const response = await fetch(url, { headers });
	if (!response.ok) {
		throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText}`);
	}
	return response;
}

async function fetchRepositoryMetadata(repoPath) {
	const response = await request(`https://api.github.com/repos/${repoPath}`);
	return response.json();
}

async function fetchRepositoryReadme(repoPath) {
	const response = await request(`https://api.github.com/repos/${repoPath}/readme`, {
		accept: "application/vnd.github.raw+json",
	});
	return response.text();
}

function extractIntroParagraphs(readme) {
	const lines = readme.split("\n");
	const paragraphs = [];
	let bucket = [];
	let inCodeBlock = false;

	for (const rawLine of lines) {
		const line = rawLine.trim();

		if (line.startsWith("```")) {
			inCodeBlock = !inCodeBlock;
			continue;
		}
		if (inCodeBlock) continue;
		if (!line) {
			const paragraph = stripMarkdown(bucket.join(" "));
			if (paragraph.length >= 50) paragraphs.push(paragraph);
			bucket = [];
			if (paragraphs.length === 2) break;
			continue;
		}
		if (
			line.startsWith("#") ||
			line.startsWith("![") ||
			line.startsWith("[![") ||
			line.startsWith("<img") ||
			line.startsWith("<picture") ||
			line.startsWith("|") ||
			/^[-*+]\s/.test(line) ||
			/^\d+\.\s/.test(line)
		) {
			continue;
		}
		bucket.push(line);
	}

	if (bucket.length > 0 && paragraphs.length < 2) {
		const paragraph = stripMarkdown(bucket.join(" "));
		if (paragraph.length >= 50) paragraphs.push(paragraph);
	}

	return paragraphs.slice(0, 2);
}

function extractFeatureBullets(readme) {
	const lines = readme.split("\n");
	const featureLines = [];
	const fallbackLines = [];
	let currentHeading = "";

	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line) continue;

		if (/^#{1,6}\s/.test(line)) {
			currentHeading = stripMarkdown(line.replace(/^#{1,6}\s*/, "")).toLowerCase();
			continue;
		}

		if (/^[-*+]\s/.test(line) || /^\d+\.\s/.test(line)) {
			const bullet = stripMarkdown(line.replace(/^([-*+]|\d+\.)\s*/, ""));
			if (bullet.length < 12) continue;

			if (
				/(feature|features|capabilit|highlight|supported|what you can do|功能|特性|特点|亮点)/i.test(
					currentHeading,
				)
			) {
				featureLines.push(bullet);
			} else {
				fallbackLines.push(bullet);
			}
		}
	}

	return uniq(featureLines.length > 0 ? featureLines : fallbackLines).slice(0, 4);
}

function inferTraits(repo, readme, trendingDescription) {
	const text = `${repo.description ?? ""}\n${trendingDescription}\n${readme}`.toLowerCase();
	const traits = [];

	if (/(offline|on-device|device-side|local\b|edge)/.test(text)) {
		traits.push("强调本地或端侧运行，适合对隐私和延迟敏感的场景。");
	}
	if (/self-hosted|self hosted|nas/.test(text)) {
		traits.push("突出自托管能力，数据掌控权更强。");
	}
	if (/mcp|tool use|function calling|extension|extensible/.test(text)) {
		traits.push("工具扩展和外部集成能力比较强，适合接入更复杂的工作流。");
	}
	if (/cross-platform|android|ios|web|desktop/.test(text)) {
		traits.push("跨平台覆盖面比较广，不局限于单一终端。");
	}
	if (repo.language) {
		traits.push(`仓库当前主要语言是 ${repo.language}，工程落地方向比较明确。`);
	}
	if ((repo.stargazers_count ?? 0) > 10000) {
		traits.push("社区关注度已经比较高，资料和生态通常会更成熟一些。");
	}

	return uniq(traits).slice(0, 3);
}

function inferAudience(repo, readme, trendingDescription) {
	const text = `${repo.description ?? ""}\n${trendingDescription}\n${readme}`.toLowerCase();

	if (/self-hosted|photo|video|gallery|backup/.test(text)) {
		return "适合在意数据掌控权的个人用户、自托管爱好者，以及需要媒体资产管理的小团队。";
	}
	if (/android|ios|edge|on-device|offline/.test(text)) {
		return "适合移动端开发者、边缘 AI 团队，以及正在评估端侧模型落地方案的工程师。";
	}
	if (/code|repository|agent|mcp|developer|cli/.test(text)) {
		return "适合已经把 AI 引入开发流程、希望提升自动化和代码理解效率的工程师。";
	}

	return "适合对这个方向有持续关注、希望快速评估项目成熟度和适用场景的开发者。";
}

function buildComment(repo, readme, trendingDescription) {
	const text = `${repo.description ?? ""}\n${trendingDescription}\n${readme}`.toLowerCase();

	if (/self-hosted/.test(text)) {
		return "这类项目的吸引力不只在功能本身，更在于它把“数据主权”做成了真正可用的产品体验。";
	}
	if (/on-device|edge|offline/.test(text)) {
		return "它更像是在回答“模型怎样真正跑到设备上”这个工程问题，而不只是做一个演示页面。";
	}
	if (/agent|mcp|tool/.test(text)) {
		return "它代表的不是又一个聊天壳，而是 Agent 正在进一步接近真实工作流。";
	}

	return "从今天的热度看，这个项目已经不仅仅是概念展示，而是在向可持续使用的工具形态靠近。";
}

function buildPostContent({ today, repositories }) {
	const intro = [
		"今天把 GitHub Trending 上最靠前的 5 个项目重新过了一遍，尽量不只看标题，而是结合仓库 README 和项目描述，判断它们到底在解决什么问题。",
		"这一期最明显的信号是：Agent 基础设施、端侧 AI，以及强调自托管和数据掌控权的产品，仍然是开源世界里最容易吸引开发者持续关注的方向。",
	].join("\n\n");

	const sections = repositories
		.map((item, index) => {
			const starsLine = item.starsToday ? `今日趋势参考：${item.starsToday} stars today` : "今日趋势参考：GitHub Trending 当日上榜项目";
			const introParagraph = item.introParagraphs[0] || item.repo.description || item.trendingDescription;
			const featureList = item.features.length > 0
				? item.features.map((feature) => `- ${feature}`).join("\n")
				: "- 该项目的 README 更偏整体介绍，这次主要根据仓库描述和首页信息做整理。";
			const traitsList = item.traits.length > 0
				? item.traits.map((trait) => `- ${trait}`).join("\n")
				: "- 这个项目的主要特点是定位明确，仓库首页信息也比较完整。";

			return `## ${index + 1}. ${item.repo.name}

仓库地址：[${item.repo.full_name}](${item.repo.html_url})

${starsLine}

### 它是做什么的

${introParagraph}

### 核心功能

${featureList}

### 主要特点

${traitsList}

### 适合什么人

${item.audience}

### 一句话点评

${item.comment}`;
		})
		.join("\n\n");

	return `---
title: "GitHub 热门项目观察（${today.zh}）"
published: ${today.iso}
description: "整理 ${today.zh} GitHub Trending 前 5 个项目，介绍它们在做什么、核心功能、主要特点和适用场景。"
tags: ["GitHub", "Trending", "开源", "项目观察", "AI"]
category: 热点追踪
draft: false
---

# GitHub 热门项目观察（${today.zh}）

${intro}

${sections}

## 结语

如果只看今天这份榜单，我会更关注三件事：

- Agent 工具是不是正在从“会聊天”走向“会执行任务”。
- 模型能力是不是正在更稳定地落到本地和边缘设备上。
- 用户是不是越来越愿意为了数据掌控权去选择自托管产品。

这些方向未必总是最热闹，但很可能会是接下来几年真正沉淀下来的长期主题。

## 参考来源

- GitHub Trending（${today.zh}）：[https://github.com/trending](https://github.com/trending)
${repositories.map((item) => `- ${item.repo.full_name}：[${item.repo.html_url}](${item.repo.html_url})`).join("\n")}

*本文由 GitHub Actions 于 ${today.zh} 自动生成，并基于 GitHub Trending 页面与仓库 README 信息整理。*
`;
}

async function main() {
	const today = formatDateParts();
	const existingPosts = await listExistingTrendingPosts();
	const todayFilename = `github-trending-${today.iso}.md`;
	const todayPath = path.join(POSTS_DIR, todayFilename);
	const latestPost = existingPosts.at(-1);

	if (!force && latestPost && latestPost.date !== today.iso) {
		const distance = Math.floor((parseIsoDate(today.iso) - parseIsoDate(latestPost.date)) / DAY_MS);
		if (distance < 3) {
			console.log(`Skipping generation: latest trending post is ${latestPost.date}, only ${distance} day(s) ago.`);
			return;
		}
	}

	const trendingResponse = await request("https://github.com/trending?since=daily", {
		accept: "text/html",
	});
	const trendingHtml = await trendingResponse.text();
	const trendingRepositories = parseTrendingRepositories(trendingHtml);

	if (trendingRepositories.length < 5) {
		throw new Error(`Expected 5 trending repositories, received ${trendingRepositories.length}.`);
	}

	const repositories = [];
	for (const trendingRepo of trendingRepositories) {
		const repo = await fetchRepositoryMetadata(trendingRepo.path);
		const readme = await fetchRepositoryReadme(trendingRepo.path);
		repositories.push({
			repo,
			trendingDescription: trendingRepo.trendingDescription,
			starsToday: trendingRepo.starsToday,
			introParagraphs: extractIntroParagraphs(readme),
			features: extractFeatureBullets(readme),
			traits: inferTraits(repo, readme, trendingRepo.trendingDescription),
			audience: inferAudience(repo, readme, trendingRepo.trendingDescription),
			comment: buildComment(repo, readme, trendingRepo.trendingDescription),
		});
	}

	const content = buildPostContent({ today, repositories });

	await mkdir(POSTS_DIR, { recursive: true });

	let previousContent = "";
	try {
		previousContent = await readFile(todayPath, "utf8");
	} catch {
		previousContent = "";
	}

	if (previousContent && !force && !previousContent.includes("本文由 GitHub Actions")) {
		console.log(`Skipping update for ${todayFilename}: existing post was not generated by GitHub Actions.`);
		return;
	}

	if (previousContent === content) {
		console.log(`No content changes for ${todayFilename}.`);
		return;
	}

	if (dryRun) {
		console.log(`Dry run successful for ${todayFilename}.`);
		return;
	}

	await writeFile(todayPath, content, "utf8");
	console.log(`Wrote ${path.relative(ROOT_DIR, todayPath)}.`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
