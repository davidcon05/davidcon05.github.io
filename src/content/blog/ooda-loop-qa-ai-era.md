---
title: "The OODA Loop for QA: A Survival Framework for the AI Speed Crisis"
date: 2026-07-24
category: "AI-Assisted Development"
tags: ["QA", "Testing", "AI", "Leadership", "Automation", "Analytics"]
readingTime: 9
excerpt: "A dinner conversation about QA bottlenecks pulled me back to a launch where iOS was months behind and nobody trusted the UI tests we had. AI has put every QA team in that same crunch. Here's the decision framework I learned in the Army that gets you out of it."
status: "PUBLISHED"
order: 6
featured: true
featuredOrder: 1
takeaway: "AI didn't create the QA bottleneck, it just removed the slack that used to hide it. The OODA loop is how you decide what to trust, automate, and act on next, before the backlog makes that decision for you."
---

A friend and I were at dinner, and he was telling me about his current project: little to no user journey testing, a blackbox regression cycle, and a real worry about how that holds up as the team matures its process and tries to ship features to users at a better cadence. I've known this friend a long time, because years ago the two of us worked the same launch together — a new backend, a POS update, and native mobile apps on both Android and iOS. iOS was behind. Not a little behind — behind in the way that makes everyone stop asking "when" and start asking "how."

We hadn't automated all the feature flows yet, which meant rigorous manual validation of everything, on a clock. Worse, the UI tests that did exist had lost the room. They were flaky — partly GitHub Actions, partly other things I'll get into another time — and once a suite gets a reputation for crying wolf, developers stop looking at it at all. You end up doing the thing automation was supposed to save you from: a human checking every path, by hand, against a deadline.

Listening to him describe his current project, years and companies removed from that old one, I kept coming back to how circular this all is. Different codebase, different team, same fundamental fight: the more things change, the more they stay the same. That old crunch was survivable because it was temporary, and because it predated AI — ship the launch, then go fix the foundation.

What's stuck with me since is that AI has turned that temporary crunch into a permanent condition. Code lands faster than any team can manually validate it, automated coverage is perpetually behind the feature set, and trust in the test suite is under the same pressure it was back then — just continuously, instead of for one launch window. If I were parachuted in today to bail out a QA team drowning in AI-generated changes, I wouldn't reach for a new tool first. I'd reach for a decision framework.

## Borrowing a Framework From a Different Kind of High-Tempo Environment

Before any of this, I was Airborne Infantry in the 82nd Airborne, where I first ran into the **OODA loop** — Observe, Orient, Decide, Act. Boyd built it for fighter pilots, but it generalizes to any environment where the situation changes faster than your ability to fully analyze it and conditions are ambiguous enough that waiting for certainty is itself a decision. That's a fair description of QA right now. The team that cycles through Observe → Orient → Decide → Act faster and more deliberately than the chaos around them is the team that stays in control instead of just reacting to whatever broke last.

Mapped onto QA in the AI era, the loop looks roughly like this:

- **Observe** — what are the signals telling you about where quality and trust actually stand right now, not where you assume they stand.
- **Orient** — what context, history, and bias do you need to correctly interpret those signals (this is where the iOS launch history and the "developers stopped trusting the suite" scar tissue comes back in).
- **Decide** — given the read, what's the actual call on where to invest: automation, manual surge, quarantine, tooling, headcount.
- **Act** — what gets executed, and how does the loop feed back into Observe so it doesn't become a one-time fix.

The rest of this post is that loop, applied.

## Observe

Every OODA cycle starts the same way: take in everything before you start explaining anything.

On a QA effort that's losing the race against AI-driven velocity, "everything" means pulling input from every seat at the table, not just the one closest to you:

- **The platform tech leads** (iOS, Android, backend) — what does each of them think is actually going wrong, and where do their stories about the same feature disagree?
- **The product owner** — what does the roadmap say is slipping, and what customer-facing pain are they actually hearing about?
- **QA itself** — what does the team on the ground say is slowing them down, day to day?
- **The analytics and the metrics** — what do escaped-defect counts, regression cycle time, flaky-test rate, and coverage say, independent of what anyone in the first three groups believes?

Nobody on that list is lying to you, but nobody has the whole picture either. Every read is a mix of real signal and someone's blind spot. The discipline of Observe is resisting the pull to start fixing the moment the first plausible story lands, usually from whoever is loudest, or whoever got to you first. The details that let you Orient toward the real problem are sitting in the gaps between what people believe and what the metrics actually say. Skip this step and you're not solving the team's problem, you're solving the problem of whoever briefed you first.

## Orient

Orient is where you take everything gathered in Observe and trace it through to a conclusion, instead of stopping at a hunch.

Say the tech leads flag the UI suite as flaky, the product owner says regression is taking too long to close out a release, and the analytics show a real, measurable rise in bugs escaping to production despite all the manual effort thrown at it. Taken together, that reads as one obvious conclusion: manual regression can't keep pace anymore, and there's a backlog of neglected test cases sitting behind it.

That's the easy read. Orient means not stopping there, and asking *why*:

- Is it because QA never aligned the platforms to a single quality plan, so iOS and Android are each quietly deciding for themselves what "done" means for the same feature?
- Is it a culture problem — a ship-fast-and-break-things mentality that treats test debt as next quarter's problem?
- Or is it a skills gap in the test practice itself: people who can write *a* test, but were never taught to write the test that actually reflects how a user moves through the feature?

Same three symptoms, three very different root causes, three very different fixes. Get this step wrong and you'll spend a quarter loudly "fixing flakiness," only to watch the same category of bug escape next release, because you treated the symptom the loudest voice in Observe happened to name, not the disease underneath it.

## Decide

Decide isn't about solving every problem Orient surfaced. It's about ranking them.

There will always be more real problems than there is time or headcount to fix in one pass. If developers on a given platform were never taught to write tests that reflect an actual user journey, you're going to keep missing things that matter no matter how much automation you throw at it. If bugs are clustering hard on one platform, the tempting move is to point at that platform's developers, but the actual fix might have nothing to do with any one team's skill, and everything to do with the fact that there was never a shared plan holding either of them to the same bar. A single unifying document per feature, these are the test cases both platforms align to, this is what we automate against that shared definition, can outperform blaming anybody.

Decide means proposing the action as a **tiered plan**, not a single fix. You name the real problems out loud, admit there are several live at once, and then choose the one thread that, if you pull it, creates the most improvement across everything else. You commit to that first, and you say out loud what you're explicitly not fixing yet, instead of pretending one plan solves all of it at once.

## Act

Act is doing the thing you decided on. Today, "doing the thing" increasingly means putting AI to work exactly where it's strongest right now: drafting test plans, generating test cases against the unified definition that came out of Decide, and even writing the automation itself, with a human still supervising what comes back, not rubber-stamping it.

That supervision can't be a single review at the end of a big AI-generated diff, or you're just trading one kind of flaky, untrusted test suite for another. It has to be its own small loop: scope the test cases before any code gets written, review the generated automation against platform-idiomatic patterns and flakiness before a human ever runs it, then debug with screenshots and view hierarchies instead of raw stack traces when something fails. I wrote the full version of that process in [Loop Engineering](/blog/loop-engineering-test-automation) — small, gated loops instead of one giant prompt are what keep AI-written automation from becoming the next suite nobody trusts.

> [!TIP]
> Despite reading like a clean 1 → 2 → 3 → 4 walkthrough, this is not a checklist you run once. It's a loop.

Every action earns a pause to re-Observe: did the flaky-test rate actually move, or did it just quiet down for a sprint? Did escaped defects drop, or did they just relocate to the platform you weren't watching as closely? That new read feeds back into Orient, which reshapes what you Decide to act on next. You're not executing a four-step plan once, you're tightening a loop, cycle over cycle, until the turmoil actually resolves instead of just relocating.

## Closing the Loop

Fast forward to where I am today: a fintech project shipping native Android and iOS apps, still mid-development. We just closed out our first Statement of Work, on time. The contrast with that old iOS launch is the whole point.

Back then: a manual test plan built by hand off requirements docs, epics, and designs — one to three days to write depending on the feature, another day to get it reviewed, before a single test case existed. That was the tax we paid for quality, and paying it under a launch deadline is exactly the crunch this post opened with.

Today, that first day (or three) is an AI skill's job, not mine. Feed it the requirements doc, the epic, the design, and it drafts the test plan and generates the test cases we align on as a team — the same unifying document that showed up back in Decide, just produced in minutes instead of days. Alongside it, we've built a mobile automation environment that finally does for native apps what the DOM has always done for web: interceptors feed in the exact data we need to walk happy paths, empty states, error cases, and edge cases, on demand, with coverage that lines up across iOS and Android instead of drifting apart platform by platform.

None of that eliminates manual testing. It relocates it. With the acceptance-criteria-shaped work handled, the humans on the team get to spend their time on exploratory testing — hunting for the defects a user would actually notice, the ones that never show up in a requirements doc, because the requirements doc was never written in the user's language to begin with.

From the project with the flaky suite nobody trusted to the one I'm on now, the throughline for me has never really changed: how do you build a stronger quality engineering practice than the one you inherited. I think that instinct comes from my time in the 82nd, where we had a saying — *you can always improve your defensive posture.* That's exactly how I've come to see testing. It isn't a gate you pass once. It's a defensive posture against bugs that neither a tired human nor a confident AI is ever going to catch with full accuracy, and the only way to hold that posture is to keep running the loop — Observe, Orient, Decide, Act — and back around again.
