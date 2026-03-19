#!/usr/bin/env bash
set -euo pipefail

TODAY=$(date +%F)
ISO_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

POST_DIR=~/Documents/golove.github.io/src/content/posts
mkdir -p "${POST_DIR}"

FILE="${POST_DIR}/${TODAY}.md"

cat > "${FILE}" <<EOF
---
title: "X.com 热门帖子 ${TODAY}"
date: ${ISO_DATE}
tags: [x.com, hot, ${TODAY}]
---

# 今日 X.com 热门帖子

- (示例) 帖子 1
- (示例) 帖子 2
- (示例) 帖子 3
- (示例) 帖子 4
- (示例) 帖子 5
- (示例) 帖子 6
EOF

cd ~/Documents/golove.github.io
git add "${FILE}"
git commit -m "Add X.com hot posts for ${TODAY}"
git push
