---
title: "Loop Engineering: Preventing AI Slop in Mobile Test Automation"
date: 2026-07-18
category: "AI-Assisted Development"
tags: ["Testing", "AI", "Mobile", "Automation", "Loop Engineering"]
readingTime: 7
excerpt: "How we mapped the classic SDLC to a set of four agentic AI skills, designing high-discipline loops that empower test engineers without burning a fortune in API tokens."
status: "PUBLISHED"
order: 5
featured: true
featuredOrder: 3
takeaway: "Small, disciplined loops keep reviews human-scale, code clean, and prevent AI agents from burning tokens blindly."
---

If you have spent any time in software engineering over the last few decades, you know the Software Development Life Cycle (SDLC) by heart: **Planning, Requirements Analysis, Design, Implementation (Coding), Testing, and Deployment**.

In the age of generative AI, there is a temptation to compress all of these steps into a single, lazy prompt: *"Write me a test suite for this feature."*

But in the real world—especially when working with native mobile test automation—that shortcut is a recipe for disaster. It leads to what I call **AI Slop**: bloated, flaky, copy-pasted UI tests that cover things that should have been simple unit tests, and codebases that no one on the team actually understands.

I recently faced a version of this challenge at work. I was tasking a team of Test Engineers (TEs) with improving native mobile automation coverage. The catch? **They had no native iOS or Android test automation experience.**

Whenever I asked them to analyze unit test coverage at the end of a feature sprint and align it with the test pyramid, I'd get the same anxious response:

> *"So... what tests do you want?"*

Mobile automation has a steep learning curve. The nuances of asynchronous rendering, dynamic layouts, flaky elements, and platform-specific runner quirks take years of trial-and-error to master. In an AI-driven world that is in a bigger hurry than ever, we don't have days to complete a task we have hours. We needed to bridge the gap.

The answer wasn't to let the AI write all the tests. The answer was **Loop Engineering**.

---

## What is Loop Engineering?

Loop engineering is the practice of mapping the classic SDLC phases into structured, agentic AI feedback loops. Instead of asking a model to execute a massive, open-ended task in a single shot, you break the task into small, sequential loops that require explicit human intervention and verification at key transition gates.

To bring this to life for my mobile test engineering team, I designed a system of **four specialized AI skills (or plugins)**. Individually, they act as focused tools; combined, they form a self-reinforcing quality loop.
![Loop Engineering Flowchart](/images/loop_engineering_flow.png)

### The Four Skills

1. **Native Android Automation Skill:** The orchestrator for Android-focused runs.
2. **Native iOS Automation Skill:** The orchestrator for iOS-focused runs.
3. **Test Case & Coverage Skill:** The analyst. It inspects the app's feature package structure and logic to determine states, pathing, and input data.
4. **Automation Review Skill:** The gatekeeper. A suite of subagents checking frontend semantics, platform-idiomatic code, DRY/SOLID principles, linting, and flakiness.

Here is how these skills work together within the two primary loops.

---

## Loop 1: Planning and Scoping (Avoiding the Test Pyramid Trap)

When the engineer starts a task, they invoke the parent platform skill (Android or iOS). This skill immediately kicks off the **Test Case & Coverage Skill** to handle Planning, Requirements, and Design.

Instead of writing code right away, the AI analyzes the application's actual codebase:

* It maps out the package structure and layout logic.
* It determines the number of states and paths leading to a feature.
* **Critically (for Android):** It identifies which scenarios are already covered by lightweight unit or Robolectric tests.

This prevents the team from falling into the anti-pattern of using heavy, slow UI instrumented tests to cover logic that belongs in unit tests.

At the end of this analysis, the tool presents the Test Engineer with a structured markdown list of proposed test cases.

**This is the first human gate.** The TE reviews the list. If they say *"No, we don't need UI test coverage for the network error state; that's already in the unit tests,"* the loop restarts and refines. If they approve, we move to Loop 2.

---

## Loop 2: Implementation and the Automated Review

Once the scoping is approved, Loop 2 begins:

1. **Branching & Coding:** The AI automatically creates a git branch and starts implementing the first test case.
2. **The Automation Review Skill:** As soon as the code is written, the Review Skill is triggered. It spawns specialized subagents to check the code against:
   * **Frontend Semantics:** Are we using proper accessibility identifiers and semantic tags instead of brittle coordinates or text matches?
   * **Idiomatic Patterns:** Does it look like clean Kotlin/Swift code, or is it a translated Java/Objective-C mess?
   * **Best Practices:** Is it DRY (Don't Repeat Yourself), SOLID, lint-compliant, and free of typical flaky wait-state patterns?

Only after these subagents approve does the code go to the human Test Engineer.

---

## The Debugging Loop: Stopping the $100 Token Burn

This is where the magic (and cost-savings) happens.

In my early experiments, I let AI agents run completely autonomously. When a test failed, the agent would grab the stack trace, try to fix the locator, run it again, fail again, guess again, and so on. **I lost $100 in API tokens in a single afternoon** watching an agent get stuck in a recursive loop trying to "fix" a dynamic overlay it couldn't see.

AI lacks visual context. It doesn't know that a keyboard is blocking a button, or that a dynamic popup was dismissed too slowly by the platform OS.

In our Loop Engineering flow, the human engineer is responsible for executing the test locally. If it fails:

> [!TIP]
> **Don't just feed raw stack traces back to the AI.** Feed it visual context. Give the agent a screenshot and a dump of the active view hierarchy.

By acting as the "visual spotter" for the AI, the Test Engineer provides the missing context instantly. The debug step kicks back to the coding phase, runs the review skill, and yields a corrected implementation in seconds.

If the test passes, the human does a final code review to check validations and test logic. If edits are needed, we loop back to coding. If it looks great, it gets merged.

---

## Why Small Loops Win

By breaking the SDLC down into small, structured micro-loops:

* **Cognitive Load is Reduced:** The Test Engineer is only reviewing one test case implementation at a time, making it much easier to catch subtle logical issues.
* **No AI Slop:** Every test case is explicitly designed to cover a specific gap, preventing the generation of redundant, brittle tests.
* **On-the-Job Mentorship:** Because the AI review skill checks for idiomatic mobile testing patterns (like avoiding arbitrary sleep calls and using correct test runners), the TEs learn mobile best practices through real-time feedback.
* **Token Efficiency:** The human stops the AI *before* it spirals into expensive, blind guess-and-correct loops.

Loop Engineering isn't just about automation; it's about control. It transforms AI from an unpredictable generator of code into a disciplined, tire-changing crew that keeps the project moving safely and cost-effectively.
