#!/usr/bin/env bash
set -eu
export FM_T3CODE_TOKEN_FILE="$PWD/.t3-validation/home/token"
project=$(node -p 'JSON.parse(require("fs").readFileSync(".t3-validation/project.json")).projectId')
selection='{"instanceId":"codex","model":"gpt-6.2-sol"}'
node bin/fm-t3-mcp.mjs status
node bin/fm-t3-mcp.mjs launch --project "$project" --title 'Firstmate synthetic captain' --model-selection "$selection" > .t3-validation/parent.json
parent=$(node -p 'JSON.parse(require("fs").readFileSync(".t3-validation/parent.json")).threadId')
. bin/backends/t3code.sh
for kind in linked plain missing; do
  title="fm-$kind"
  args=()
  if [ "$kind" = linked ]; then
    title=$(fm_backend_t3code_thread_title 'ws/checkout' fm-linked)
    args+=(--delegated-from "$parent")
  elif [ "$kind" = missing ]; then
    args+=(--delegated-from 'mcp:00000000-0000-0000-0000-000000000001')
  fi
  node bin/fm-t3-mcp.mjs launch --project "$project" --title "$title" --branch fm/lab --worktree "$PWD/.t3-validation/worker" --model-selection "$selection" "${args[@]}" > ".t3-validation/$kind.json" 2> ".t3-validation/$kind.err"
  cat ".t3-validation/$kind.json" ".t3-validation/$kind.err"
  id=$(node -p "JSON.parse(require('fs').readFileSync('.t3-validation/$kind.json')).threadId")
  node bin/fm-t3-mcp.mjs read --thread "$id" > ".t3-validation/$kind-read.json"
  cat ".t3-validation/$kind-read.json"
done
