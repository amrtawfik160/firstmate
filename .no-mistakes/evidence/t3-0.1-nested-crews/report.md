# T3 nested crews live validation

Target: 0accb04e68f792ab84fe862dfc928326f11a9126. Result: **no-go**.

Six scenarios ran against disposable real local T3 servers with synthetic projects and threads. The installed T3 0.1.10 and workspace-local T3 0.1.0 both accepted sign-in, configured launches, and listed/read/responded to real Codex worker questions through completion. Existing provider authentication was used; production T3 environments were not touched.

The readable-parent launch failed the intended captain link: the worker completed a real Codex turn in its task worktree, but the UI after reload showed no link. Persisted thread, messages and orchestration events contain zero delegatedFrom occurrences. A full fm-spawn launch also completed without the relationship. See final-titles-and-link.png, final-thread-readback.json and persisted-child-state.json.

Other live scenarios passed: unreadable-parent launch warned and continued; full fm-spawn --base-branch ws/title produced ws/title · fm-qatitle; full fm-spawn without the flag or T3CODE_THREAD_ID produced fm-qaplain. Both full spawns completed in separate task worktrees. See live-transcript.jsonl and spawn-explicit-base.log / spawn-default-base.log.

Repair requires a T3-side persistence/rendering solution or an authorized different linkage strategy. Upgrading away from required T3 0.1.10 or substituting delegate_task and losing task isolation was left unapplied.

Baseline: tests/fm-t3-mcp.test.sh passed. The backend test file stopped at its secondmate fixture because placing TMPDIR inside this repository makes that fixture violate the existing outside-repository home guard. Focused ordinary-task spawn and title cases passed separately. The opt-in live guard passed against disposable 0.1.10. No complete repository suite, linter or static analysis ran.

Browser sessions and both disposable servers were stopped; all 12 server-owned processes were confirmed stopped. Temporary workspace fixtures and the incidental Treehouse .gitignore entry were removed. No source changes remain.
