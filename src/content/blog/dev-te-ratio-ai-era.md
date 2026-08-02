---
title: "The DEV:TE Ratio Was Never About Headcount"
date: 2026-07-30
category: "Testing & Quality"
tags: ["QA", "Testing", "AI", "Leadership", "Metrics"]
readingTime: 10
excerpt: "A 3:1 dev-to-TE ratio used to be the golden staffing rule on my team — until AI nearly doubled dev output and even a headcount drawdown couldn't bring it back. Running the real numbers puts the effective ratio closer to 5:1, and the automation gains that did land never touched the part of the job that actually dominates the week: manual validation. Here's the math, what's still missing, and why I think testing itself has to change."
takeaway: "AI gave devs an efficiency gain that validation never got — headcount can't fix that gap, only rethinking what gets validated, by whom, and how, can."
status: "PUBLISHED"
order: 8
featured: true
featuredOrder: 1
---

It's quick to ship code now. It's not quick to validate it. That gap is the whole story, and I have the numbers to prove it's not a feeling.

The moment it actually landed wasn't mid-sprint, it was in the room after. We'd just closed out our first Statement of Work, on time — I'd driven the TE team hard all summer to make sure we hit that obligation, and we did. I should have walked out of that retro feeling like we'd won. Instead I felt defeated, because the iOS team was already drawing down, from 8 devs back to 5, and out of habit I ran the ratio anyway. It didn't get better. It barely moved.

## The old math

Pre-AI, on this same project, the numbers were boringly consistent, sprint after sprint: the weakest dev on the team turned in about 2 tickets. The average dev, 3 to 4. The best dev, 4 to 5. Nobody wrote that down as a rule anywhere — it was just what actually happened, reliably enough that you could plan a TE headcount against it. That's where "3:1" came from as a planning ratio: not an industry standard pulled from a textbook, but the number that fell out of watching real sprints long enough to trust it.

## What actually changed

Same project, same ticket sizing, different numbers. My weakest dev is now turning in 5 tickets a sprint. My average dev, 6. My best devs, 7 to 9. Output roughly doubled — and it's not just the existing devs getting faster individually. It's headcount, too: iOS fell behind, so we brought on 4 extra devs. All of them AI-native from day one, all of them turning in 5-6 tickets a sprint each, right out of the gate. Two compounding effects at once — existing devs producing roughly double what they used to, and more devs added on top of that, each one already producing at the new, higher baseline — and the number of TEs validating all of it stayed exactly where it was, because it wasn't in the budget.

## Why the ratio breaking is a problem, not just a win

The obvious response is: great, AI made the team more productive. That's true for devs. It is not equally true for validation, and that asymmetry is the actual problem.

AI helps TEs too — it's fast at scanning for the right test accounts, or checking the code to make sure a payload is shaped the way it should be. But none of that absolves the part of the job that's actually slow: cross-checking the Swagger spec and the acceptance criteria to confirm you're keying on the right object and the right property, and that the implementation is actually correct against what was asked for. AI can hand you the payload faster. It can't do the judgment call of "is this the right payload for what this ticket actually promised."

It gets worse under the current workflow, not better. Testing happens on main now, and a ticket ships as one or more MRs — each needing two approvals, each capped around 400 lines. On paper that should make validation easier: smaller diffs, more eyes on the code before it merges. In practice, it's the same ticket broken up into several MRs, and a TE doesn't see any of it until all of them have landed. Before, a piece of work that size would have shown up in smaller, testable chunks along the way. Now it shows up once, assembled, as one larger change that's technically been looked at by three people — the dev and two approvers — across one or more MRs, and validated by none of them against the actual Swagger spec and AC.

So look at it through the old 3:1 lens instead of treating the numbers as separate facts. Here's the actual roster: 4 Android devs, 8 iOS devs (the original team plus the 4 reinforcements), one engineering manager who contributes to the codebase occasionally, and 4 TEs. Count just the devs and TEs and the ratio on the org chart is exactly 3:1 — 12 devs, 4 TEs. Nothing about the *staffing* changed.

The workload behind it did. Using the average-dev figure as a stand-in for the team:

| Scenario | Devs | TEs | Nominal ratio | Tickets / TE / sprint | Effective ratio* |
|---|---|---|---|---|---|
| Old rate (pre-AI) | 12 | 4 | 3:1 | 10.5 | 3:1 |
| Current rate, iOS at 8 | 12 | 4 | 3:1 | 18 | ~5.1:1 |
| Current rate, iOS drawn down to 5 (SOW1 retro) | 9 | 4 | 2.25:1 | 13.5 | ~3.9:1 |

*Effective ratio converts today's tickets-per-TE back into "how many old-rate devs would generate that many tickets a sprint" — the workload a TE is actually carrying, measured against the org's own historical baseline, not the number on the org chart.

The org chart says the ratio got better — 3:1 down to 2.25:1 by the SOW1 retro, the kind of number that should have made the room feel lighter. The effective ratio tells a different story: it barely moved, and it never got back to the 3:1 the team was actually built around. That's because the thing driving it was never headcount. It was throughput per person, and losing three devs doesn't undo what AI did to the other nine.

Rough is fine here — the average-dev figure (6) is a deliberate estimate, not a precise weighting of every individual. The shape of the problem is the point, not the third decimal.

## What TEs actually have to do about it

Before getting to the fix, it's worth being honest about what the job actually is. A TE's week runs across:

- Writing test plans
- Adding test cases to Jira
- Writing UI tests
- UAT review, so the app can be turned over to the client for feature sign-off
- Manual validation against acceptance criteria
- Accessibility reviews
- Regression
- Client-facing documentation for features — environment switchers, Sauce Labs setup, that kind of thing

Of everything on that list, manual testing is the single biggest time sink — and the reason isn't that it's inherently slow, it's how the queue prioritizes it. Unless someone's already been set aside to cover manual validation for the sprint, the expectation is that whatever anyone's working on — automation, test plans, test cases, whatever else is in flight — gets set down to handle it, because closing out ticket validation is what actually closes the work. The last several sprints, that's meant the proactive TE work doesn't get picked back up until the second-to-last or last day of the sprint, which is exactly when regression also needs to happen. The queue doesn't just move slowly. It structurally guarantees a collision, every sprint, between "still validating tickets" and "also need to regress the build."

Automation is where AI actually earned its keep, and the before/after is concrete, not just a vibe. Writing automation itself used to take 2 to 5 days, because the team was new to native mobile automation and every build meant learning the platform as you went; the automation and code review skills cut that down to 1 to 2 days. Test plans used to run 1 to 2 days to write, plus another full day to review — now it's 1 day to write and review, combined. Test cases were the worst of the three: they used to drag for days, because writing one effectively meant locking in to the automation structure first, and the team was behind on that alignment. Once that got sorted, the real baseline was a day to write and a half day to review; now it's a half day to write and review, combined. (The full mechanics of that system are in [Loop Engineering](/blog/loop-engineering-test-automation) if you want the how.)

And it still isn't enough. Add it up — automation down 1 to 3 days, test plans down a day or two, test cases down close to a full day — and that's real time back across three separate parts of the job, not a rounding error. The ratio math from earlier barely notices, because none of those three things is what the queue actually prioritizes. Manual ticket validation still comes first, every sprint. So does accessibility review, which can still run 1 to 2 days on its own depending on how many screens or flows a feature touches — none of the automation gains above reach it. Those are the pieces this system never touched.

## Where this goes for the industry

Running that math enough times gets you to an uncomfortable question: what if the fix isn't "TEs work harder" or "TEs automate more," but "TEs stop doing manual testing" — push validation left, onto the people writing the code and the people reviewing it in the MR, instead of a dedicated human checking it after the fact.

My own answer leans toward automation, but not automation as it's usually pitched — more coverage bolted onto the existing process. It starts with being honest about what AI actually breaks. It's not just the volume hitting the QA step. It's the error profile. AI-generated code fails the way human code used to fail, just a higher volume: bad copy, UI that's subtly misaligned with the design, acceptance criteria that got quietly missed. The tools built to catch that automatically aren't there yet — every AI tool I've used that tries to "scan a screen" for correctness is wrong more often than it's right. That's extra review work sitting on top of the extra volume, not instead of it.

So the shift I'd actually build toward has three pieces.

**Automation gets authored differently.** Not written for manual execution first and automated later as an afterthought, but built against the design and the implementation together from the start. Test plans align test cases to automation from the beginning: more technical suites, covering real surface area — personas, happy path, empty state, error state — but mapped to actual user journeys instead of a combinatorial blow-up. Five pathways into a feature and five user actions should produce five UI tests that cover the real journeys, not twenty-five tests covering every combination nobody actually hits. That's touch point one. If you're leaning towards 25 tests, you're using automated tests to guard against an architecture failure.

**Regression gets restructured, not just squeezed.** Right now it collides with unfinished ticket validation at the worst possible moment in the sprint. In theory, if dev work actually lands earlier instead of trickling in until the last two days, regression becomes a dedicated phase where TEs and Devs validate in parallel instead of one person racing a deadline: more coverage, not less. Done badly, this is a nightmare regression cycle instead of a fix, it only works if the dev-delivery cadence changes too, not just the TE side of the process.

**Code review turns into a quality gate, not just a style check.** The code being reviewed is supposed to align to some acceptance criteria. You can't actually validate the structure of code you're reviewing if you don't understand what it's supposed to do. Devs and reviewers are the ones who gain the most from AI's speed — it follows that they should own more of the responsibility for verifying what that speed actually produced, instead of all of it landing on a TE checking it after the fact.

## Closing

This is where [the OODA Loop](/blog/ooda-loop-qa-ai-era) comes back in, not as a metaphor but as the actual mechanism. The ratio problem isn't going to get solved by one clean initiative — it's an Observe, Orient, Decide, Act problem, run over and over, adjusted every sprint as the team and the project keep changing. [Loop Engineering](/blog/loop-engineering-test-automation) is the Act: the disciplined, gated automation practice that hands some of that time back. This post is the Observe and Orient — actually running the numbers, and being honest about why the automation win doesn't close the gap on its own.

But I don't think the endpoint is "iterate faster inside the current model of testing." I think the model itself has to change. I know there are teams out there that don't validate every ticket manually — that go straight from automated coverage to release. I don't agree with that, in principle. I'm a defensively minded person: I want to know a release was validated with an actual user in mind, not just that the inputs and outputs are technically correct at the unit level, especially now, with AI in the loop. If I'm already seeing errors in copy, in design alignment, in AC that got quietly missed, it's not far-fetched that a bug is also getting into the nav graph, or into the logic that decides whether a user can enter or complete a journey at all. The small, visible errors are the warning sign for the ones that aren't visible yet.

Code is cheap now — I built a whole Android app, [DaveTV](/blog/lost-remote-built-my-own-app), before Twisters finished playing. Human hours are still the bottleneck. The industry hasn't answered what we're actually going to spend those hours on — but I'd rather spend mine engineering defensive solutions, test suites, that can keep pace with the AI and align to test plan modeled after business and user value.

That's my answer for testing specifically. Zoom out one level, and I think that same "code is cheap now" shift is what's making forward-deployed engineering feel so inevitable across the industry right now — small specialist teams embedding directly with a business unit to prototype fast, prove a productivity gain is real against actual inputs and outputs, and hand off ownership once it's worth building to scale. It's a pattern I recognize from a different life: Military Transition Teams, embedded with Iraqi forces during the drawdown to transfer capability instead of just holding the line indefinitely. That idea deserves its own post. This one's just about testing.