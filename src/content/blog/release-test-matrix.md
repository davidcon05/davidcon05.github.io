---
title: "100 Acceptance Criteria, 10 Test Cases"
date: 2026-08-08
category: "Testing & Quality"
tags: ["QA", "Testing", "AI", "Release Management", "Mobile", "Leadership"]
readingTime: 15
excerpt: "In discovery on a greenfield fintech app, I decided I wanted to go into launch with a release test matrix. It's August before I had the room to actually build it, because a team has to find its rhythm before it can produce anything worth putting in one. When I finally sat down with the acceptance criteria for a single feature, Opus handed me back all hundred-plus of them. The diagnosis wasn't the prompt. The ACs were written in Gherkin, journey-shaped grammar wrapped around function-level scope, which is exactly why extraction looked possible and exactly why it couldn't work."
takeaway: "The test case is the building block, and it carries all the weight. Written to follow a user journey, it's what we automate against, what UAT runs on, and what the release matrix reads out of."
status: "PUBLISHED"
order: 11
---

I learned test plans, test cases, automation, and regression as artifacts to produce as part of being a test engineer, each one separate and unrelated to the others. On my latest project, a greenfield fintech app shipping native iOS and Android, I learned they're linked: built with a release test matrix in mind, they form a single quality pipeline, and that pipeline is what buys velocity, quality, and traceability all at once.

## Why the matrix, and why first

At an agency, discovery is the requirements-gathering phase, before engineers get allocated to the project. It's the first point you can influence anything, and it's where I decided I wanted to go into launch with a **release test matrix**.

Discovery should also have meant being paired with someone from the client's quality department. I asked several times. The introductions were never made, so the plan for how this project would be validated was going to be mine to write, alone, against a set of requirements that was still moving: rewritten drafts of the first few features, the architecture, and a list of features whose details were coming later.

As a Staff Sergeant in the Infantry, that reads as information rather than grievance. Nobody was coming to fix it, and the plan still had to exist. The question stops being who should have been in the room and becomes how much surface area of the app we can expose to automation safely, and who can help me do it.

Ideally we operate like LGOPs, little groups of paratroopers acting on the commander's intent when the plan doesn't survive contact, or what's more commonly called a team of teams: each one working its own lane, coordinating only where the lanes intersect. That's a far cry from the silos most client teams build, each unwilling to cede responsibility inside its own domain, but it's exactly what makes us effective. We don't wait for someone to hand us permission to expose our own surface area.

A release test matrix tells you what has been validated, on what, and what hasn't. Simple to describe, and the whole difficulty is in keeping it small enough that a person will actually read it.

Most teams build it last, because most teams experience it as a reporting obligation: something the client or the Statement of Work requires, assembled at the end out of whatever evidence happens to be lying around. Built that way it's a status report. You put it together *for* the meeting instead of reading it *in* the meeting, and by the time it exists it can't change anything.

It isn't exactly built first, either. It's the thing we aspire to build, so the rest of the work has something to rally around: what you test, how you write it down, what you automate. Every line in it is a claim you'll eventually have to back with evidence, and in discovery you still get to choose whether producing that evidence will be free or expensive.

That was the theory. Here's what actually happened.

## Why it took until August

Engineers came on in February 2026. I'm building the matrix in August. My own team came on slower than that: TEs joined one at a time over six weeks, or at least it felt that way, since getting them access was so slow.

That gap isn't neglect, and it isn't a story about being too busy. Development is a team sport and a process, and it took the first half of this project for the team to find its rhythm, with quite a bit of help from [Loop Engineering](/blog/loop-engineering-test-automation) to get TEs writing native mobile automation they'd never written before. A release matrix is downstream of a team that can actually produce the evidence to fill it. Building it in February would have produced a beautiful empty document.

The real flaw was in how we sequenced the work. Test plans got written early, ahead of the feature build. Test cases and automation didn't start until a feature was already done. By the time I sat down with the matrix we'd completed the first few features, and the way the work was lined up we had **several features open simultaneously with a single dev assigned to each.** So test cases, automation, and accessibility reviews for those finished features were all landing in the same trailing window at once, uncoordinated, because nothing upstream had settled into a rhythm yet. Nobody had gotten the chance to agree on how to do it.

What that order actually buys me is the chance to norm with the whole team, assign DRIs, and start monitoring the processes, instead of taking the initiative and building them all myself without any feedback loop to refine or manage them. This isn't just retrospective, either: SOW 2 starts with everyone arriving together instead of staggered. What I'd actually claim is narrower and I think more useful: decide the *shape* in discovery, and build it the moment the team can feed it.

## First stop: acceptance criteria

The matrix needs a unit: something you can list out and meaningfully call validated or not.

The obvious answer is acceptance criteria. AC is written down, agreed to by product and dev, traceable to the ticket, and nominally what a TE validates against anyway.

I was hoping that gave me a shortcut. It didn't take long to see it wouldn't. As a TE I'm weighing three things at once: how a user actually moves through the app, what the technical requirements underneath that movement are, and the likelihood and impact of something breaking along the way, which is really just another way of looking at the same user journey. If caching breaks on a screen, nobody's hurt and the backend doesn't buckle; worst case, someone waits under two seconds for an extra API call. If payments breaks, we stop the production line and sound the fire alarm. AC can't tell you which of those two you're looking at. A journey can.

I pulled the ACs for the transactions feature: pending and complete transactions, enriched and unenriched data, contacting the vendor, empty states, error states. There were **over a hundred of them for that one feature.**

A hundred of anything is not a manageable artifact, and that's before you account for two platforms and every state a screen can be in. Volume was the smaller problem, though; the bigger one is that most of those criteria **aren't about users.** They're about functions and their outputs: this field enriches, this state transitions, this call reaches the vendor. That's correct and necessary, and it is not what a release decision is made of. Nobody holds a launch because a field-level rule is unverified in isolation. They hold launches because someone can't complete a payment.

AC is a function-level correctness contract, and I was trying to use it as a release-level coverage source. Two different altitudes, and the same mistake I made in a different costume in [Coverage Isn't Additive](/blog/ios-coverage-truth), where unit and UI coverage look like they should combine and don't.

A user journey genuinely crosses several ACs and compresses them into something more concise, the same way a UI test crosses several unit tests. AC overlaps constantly, so more of it doesn't buy more coverage; it just means repeating the same ground with no return on the repetition, and since a test case is a manual task until it's automated, that repetition doesn't just waste effort, it accrues debt at an exponential rate.

AC doesn't get replaced by any of this. Every function a user passes through still has to satisfy its criteria. It just gets *selected over.*

## The attempt that failed, and the reason it did

The right altitude is the user journey. It's the argument I made in [Nobody Trains Test Engineers Like Engineers](/blog/progression-of-automation-thinking), that we should be championing the user and their path rather than validating AC line by line.

First attempt: turn a test plan into user journeys. The dataset was still too big, and what came back were test cases that were basically AC with different formatting. The altitude problem, unsolved.

Second attempt: skip the test plan and go straight at the ACs. I had a hundred-plus of them in a document and I needed the journeys out of them. I wrote several journeys by hand as examples, handed the set to Claude Opus 5, and asked it to deliver the ACs that met those examples.

It returned every acceptance criterion.

I kept at it. Cleaned up the dataset, tightened the constraints, re-shaped the examples. **Failure after failure for a full day** before I stopped, and the thing that finally explained it wasn't the prompt at all.

**The ACs were written in Gherkin.**

That's the whole diagnosis. Gherkin is BDD grammar, Given/When/Then, so every single criterion is already phrased in user-shaped language. It *reads* like a journey. It has an actor, a context, an action, an outcome. Which is precisely why extracting journeys from it looks like a solvable problem, and precisely why it isn't: the format is journey-shaped but the scope is function-level. Half those Given/When/Thens describe something that would make a better unit test.

So a model reading that document has no signal available to separate the ones that are journeys from the ones that are unit tests wearing journey clothes. Both look identical at the grammar level, and the thing that actually distinguishes them, whether a real person moves through this to accomplish something they came here to do, isn't in the document. It's in whoever knows the product.

Handed a document where that judgment was never written down, the model did the only thing available to it: return everything, and let exhaustiveness stand in for the judgment nobody gave it.

I should have recognized that faster, because I wrote the same argument from the other end four months ago. In [The DEV:TE Ratio Was Never About Headcount](/blog/dev-te-ratio-ai-era) I argued that a model handed a screen has no idea which of the eleven tappable things a real person would reach for, because that answer doesn't live in the screen. It lives in the person. I thought that was about runtime. It isn't about screens at all. It's about judgment being absent from any artifact you hand a model, and Gherkin is a particularly good disguise for its absence.

So I stopped trying to extract judgment that was never in the document, and started supplying it myself.

## Doing it the way I'd do it manually

What broke the problem open on the third attempt was abandoning extraction and asking how I'd do this by hand, then making that algorithmic.

Four inputs:

- **Doorways:** how many ways are there into this feature?
- **User actions:** what does a person actually do once inside?
- **Screen states:** pending, complete, enriched, unenriched, empty, error
- **Personas:** whose perspective is this journey taken from?

Combine doorways with actions across screen states, per persona, restricted against a handful of worked examples. That's it. That's the whole method, and it does the thing the model couldn't. It *selects*, because every one of those four inputs is a judgment about who uses this product and how.

**Over a hundred acceptance criteria became roughly ten test cases.**

Not ten because I lost coverage. Ten because a hundred Gherkin statements about a transactions feature describe maybe ten things a person actually does with transactions, and the other ninety are function-level claims that belong in unit tests, or restatements of a path already counted.

That reduction is the entire value of the exercise, and it took a person a few hours to produce. It could not have been prompted out of the requirements at any price.

It also held up past the one feature. Four more feature-automation tickets dropped right as I finished the skill, luckily or unluckily depending on how you look at it, and I took on writing the AC for all of them myself, partly to get the tickets moving and partly to expose the method to more cases. Instead of sifting through a hundred-plus criteria per feature, I was looking at roughly ten, adding one or dropping one here and there. It was far more accurate.

## No data to cheat with

On a mature product, analytics, escaped-defect history, or a regression suite with some age on it would have picked the journeys for me. Greenfield hands you none of that. So human judgment isn't the preferred input here. It's the only one. That's why the extraction was never going to work, and it's why this has to happen in discovery rather than at the end. There's nothing to mine, so somebody has to decide, and the decision has to land somewhere durable enough to survive six months of development.

## Where it lands: three buckets in Xray

By the time I sat down to build this, we already had test plans, test cases, UAT documents, Xray regression artifacts, and SauceLabs nightly runs, which are basically every test in Core Regression's automated bucket running on its own. Pulling all of that into a traditional spreadsheet matrix looked like a lot of effort, even with AI doing the pulling. I wanted something I could keep past launch, for every release after this one, not something I'd rebuild each time. Thoughtful test cases sorted into buckets, all living in Xray, was that model: the lowest-maintenance way to keep it current, and the only one built to keep scaling instead of getting rebuilt. An engineering solution for an antiquated process.

The matrix is taking shape in Xray, organized into three buckets.

**Core Regression** is what we own and what carries customer value, sorted by feature and split into manual and automated. A case starts in manual. When it gets automated it moves. That migration *is* the progress metric, and where the split currently sits is the honest picture of how much of this launch still depends on a person having a free afternoon.

**Extended Regression** is the seams. My team owns the native mobile apps; we don't own the web flows, the backend, or any of the services underneath them. So the goal here is to test along those seams, substituting fakes where necessary, and confirm the app responds the way its AC says it should to produce a user journey. Anything that reads as more AC than journey ends up here too, along with anything that lives outside our purview entirely, like caching every endpoint and confirming we don't refresh. Real features in the app, worth having written down, just not worth time and attention until launch week, or until we need to refactor the work, since we don't truly own it.

**Backlog** is test cases for features that don't exist yet. As a feature gets developed, its cases move up into Core. That's what makes the thing a standing structure instead of a snapshot: the matrix already contains the shape of work that hasn't started.

It's been a long road to get here, and what's left is the easy part by comparison. What's still missing is tagging. The cases need tags before I can fix reporting from SauceLabs back into Xray, and until that's done the automated column can't populate itself. Once it does, **launch is launching the UI test job and walking through the manual tests in a test plan.** Not assembling evidence under deadline, just reading a result that's been accumulating for months.

## What I'd do differently on the input

One more thing came out of that wasted day. I tried the same problem against Gemini with a much smaller dataset and got a noticeably better attempt, which points at the real fix not being a better prompt or a better model, but a **smaller, better-scoped input.**

[Loop Engineering](/blog/loop-engineering-test-automation) describes the way I was taught to automate: look through a flow and automate the user actions inside it. Test cases first flips that around. Instead of looking through a flow, I can tell the model which Xray folder to open and have it run straight through the test cases already sitting there, tagging as it goes, closing the gap that's currently keeping the automated column from populating itself.

Thousands of lines of AC is still the wrong thing to hand a model for the extraction problem, though. The app is the better source there, and there's a natural way to scope it: our branch names carry the Jira ticket number, so the feature branch work itself isolates what changed for a given ticket. Point the analysis at that instead of the requirements document and you're asking a question about something concrete, rather than asking for judgment that was never written down.

I haven't built either of these yet. They're where I'd go next, and they're the same instinct: the gains come from shrinking what you hand the model, not from asking it more nicely.

## What this is all in service of

AI is putting enormous pressure on this team to manually validate everything, which is the problem I've been circling for months now. Every reliable skill I build is an attempt to buy back the hours that pressure takes.

Here's what the matrix buys. Once journeys are the organizing unit and the cases underneath them are written to be automated rather than translated into automation later, the automated column takes the breadth: the wide, repetitive validation across states and platforms that no person should spend launch week on.

That frees the humans for the two places on this product where a defect is unrecoverable, **authentication and payments.** There's a home screen in the entry path, but functionally it's a launch pad into payments. Those are the flows that get deep, careful, exploratory human attention, and everything else gets validated by something that runs identically every time at no marginal cost.

That's the same argument I made in [39 releases without a critical bug](/blog/zero-critical-bugs): concentrate human effort on auth and payment paths. The difference is that I'm no longer asking for that focus to be achieved through discipline at the end. The structure produces it.

## Closing

Andy H said "QA Factory." He said it after we shipped 39 releases without a single escape, and he meant something specific by it. We're contractors. We stay as long as the contracts renew, and he wanted to make sure we did whatever knowledge transfer was necessary to keep the QA factory humming after we weren't there to hum it ourselves.

That's stuck with me, because it's the real test of everything above. A pile of artifacts produced on request walks out the door with the person who produced them. A structure is still standing when the contract ends: journeys chosen deliberately, cases that carry them, buckets that sort themselves, a matrix that reads out of the work instead of being assembled on top of it.

There's a reason I call it a quality pipeline instead of a factory. Everyone already has a CI/CD chart in their head: build, then one small box for testing, then done. That box was never where quality engineering actually lives. We're in it before the developers even see the work, shaping what counts as done. We're in it after the last feature ships, watching what the app does in production. Put the whole team in a room and ask what we're building: product says apps that meet AC. Junior engineers say an Android app or an iOS app. Senior engineers mention quality mobile apps. As Test Lead, my answer is narrower and I think truer: native mobile apps that launch without issues, because we've been thinking about and monitoring quality the entire time, not at the one point on the chart where somebody drew a box for it.
