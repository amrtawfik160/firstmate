# T3 crew validation

Target: `0accb04e68f792ab84fe862dfc928326f11a9126`. Oracle: the supplied author intent and recorded decision excluding secondmates.

## Live results

- T3 0.1.10: isolated sign-in, capability gate, verified launch/configuration, and a real Codex plan question successfully listed, read, and answered Green. See live-transport.log, pending-question.json and question.log.
- Legacy T3 0.0.46-nightly.20261010.2935: installed locally in the disposable workspace; isolated sign-in, gate, launch/configuration, and a real Codex question successfully listed, read, and answered Green. See legacy-transport.log, legacy-pending-question.json and legacy-question.log.
- Captain link FAILED: a readable synthetic captain was supplied through `--delegated-from`. The task launched in its requested worktree and completed a real Codex turn, but no captain link appeared in the UI or persisted thread/message payloads. A control launch supplying the message at creation also completed without the link. See linked-worker.png, persisted-link.json, live-turn.log and control-link.log.
- Unreadable parent: launch succeeded with the warning explaining that the optional link was dropped. See live-launches.log.
- Real fm-spawn with real Treehouse produced `fm-titlelab` without a base branch and `ws/checkout · fm-titlebranch` with explicit `--base-branch ws/checkout`. Both workers completed LAB_OK. See spawn-results.log and spawned-titles.png.
- Secondmate exclusion: the unmodified product was materialized via `git archive HEAD` into a disposable source root so its sibling secondmate could remain inside the workspace while satisfying the product prohibition on homes nested inside its code root. Official home seeding and real fm-spawn --secondmate succeeded, with deliberately unreadable T3CODE_THREAD_ID inherited; there was no parent-read warning, and the thread title stayed fm-matelab. It completed LAB_OK. See secondmate.log and matelab-read.json.

## Setup corrections

The first backend regression invocation placed TMPDIR inside the source root, which correctly triggered its secondmate-home containment guard. The rerun uses the toolchain temporary directory. The explicit-base launch was re-driven after selecting scout mode (local-only cannot target an integration branch) and generating the supported base-branch brief with fm-brief. These were setup corrections, not product changes.

## Cleanup

All synthetic threads were archived with closed:true and activeRunId:null (cleanup.log). Chrome was stopped. Both isolated T3 servers were explicitly terminated and their exits collected (130, intentional termination); their previously recorded provider/resource-monitor/sleep-inhibitor children were absent afterward. No production T3 server, fleet session, or credential store was changed.

## Targeted regression results

The initial targeted invocation used TMPDIR inside the workspace. The client script exited 0; the backend script exited 1 at its secondmate-fixture containment guard. Rerunning `bin/fm-test-run.sh --jobs 1 tests/fm-backend-t3code.test.sh` with normal toolchain temporary storage exited 0, including inherited-parent secondmate exclusion and protocol fixtures. These fixture checks supplement the live scenarios.

Both real-server transport guards exited 0. No source changes remain. The disposable workspace data, local browser and legacy CLI download were removed after all required processes exited.
