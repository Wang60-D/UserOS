#!/usr/bin/env bash
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="change-logs"
mkdir -p "$LOG_DIR"

TIMESTAMP="$(date +"%Y-%m-%d_%H-%M-%S")"
LOG_FILE="${LOG_DIR}/${TIMESTAMP}.md"

PRE_STATUS="$(git status --porcelain)"
if [ -z "$PRE_STATUS" ]; then
  echo "没有可同步的变更，未生成日志。"
  exit 0
fi

{
  echo "# 同步日志 ${TIMESTAMP}"
  echo
  echo "## 概览"
  echo
  echo "\`\`\`"
  git status -sb
  echo "\`\`\`"
  echo
  echo "## 未暂存变更"
  echo
  if git diff --name-status | grep -q .; then
    echo "\`\`\`"
    git diff --name-status
    echo "\`\`\`"
  else
    echo "无"
  fi
  echo
  echo "## 已暂存变更"
  echo
  if git diff --name-status --cached | grep -q .; then
    echo "\`\`\`"
    git diff --name-status --cached
    echo "\`\`\`"
  else
    echo "无"
  fi
  echo
  echo "## 变更统计"
  echo
  if git diff --stat | grep -q .; then
    echo "\`\`\`"
    git diff --stat
    echo "\`\`\`"
  else
    echo "无"
  fi
} > "$LOG_FILE"

git add -A

COMMIT_MSG="${1:-sync: ${TIMESTAMP}}"
git commit -m "$COMMIT_MSG"
git push

echo "已同步并生成日志：$LOG_FILE"
