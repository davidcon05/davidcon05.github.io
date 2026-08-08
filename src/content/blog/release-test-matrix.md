---
title: "100 Acceptance Criteria, 10 Test Cases"
date: 2026-08-08
category: "Testing & Quality"
tags: ["QA", "Testing", "AI", "Release Management", "Mobile", "Leadership"]
readingTime: 12
excerpt: "In discovery on a greenfield fintech app, I decided I wanted to go into launch with a release test matrix. It's August before I had the room to actually build it, because a team has to find its rhythm before it can produce anything worth putting in one. When I finally sat down with the acceptance criteria for a single feature, Opus handed me back all hundred-plus of them. The diagnosis wasn't the prompt. The ACs were written in Gherkin, journey-shaped grammar wrapped around function-level scope, which is exactly why extraction looked possible and exactly why it couldn't work."
takeaway: "The judgment that turns 100 acceptance criteria into 10 test cases (doorways, actions, screen states, personas) isn't sitting in the requirements waiting to be extracted. Write it down once and the matrix, the automation, and the launch plan all fall out of it."
status: "DRAFT"
order: 11
---

I learned test plans, test cases, automation, and regression as artifacts to produce on request, never as stages in a quality engineering pipeline where each one exists to make the next one cheaper.

At an agency, discovery is the requirements gathering phase, before engineers get allocated to the project. It's the earliest you can influence anything, and on this one, a greenfield fintech app shipping native iOS and Android, it's where I decided I wanted to go into launch with a **release test matrix**.

Discovery should also have meant being paired with someone from the client's quality department. I asked several times. The introductions were never made, so the plan for how this project would be validated was going to be mine to write, alone, against a set of requirements that was still moving: rewritten drafts of the first few features, the architecture, and a list of features whose details were coming later.

## Why the matrix, and why first

A release test matrix tells you what has been validated, on what, and what hasn't. Rows, columns, cells. Simple to describe.

Most teams build it last, because most teams experience it as a reporting obligation: something the client or the Statement of Work requires, assembled at the end out of whatever evidence happens to be lying around. Built that way it's a status report. You put it together *for* the meeting instead of reading it *in* the meeting, and by the time it exists it can't change anything.

Built first, it's the thing that decides what you test, how you write it down, and what you automate, because every cell in that grid is a claim you'll eventually have to back with evidence. In discovery you still get to choose whether producing that evidence will be free or expensive.

That was the theory. Here's what actually happened.

## Why it took until August

Engineers came on in February 2026. I'm building the matrix in August.

That gap isn't neglect, and it isn't a story about being too busy. Development is a team sport and a process, and it took the first half of this project for the team to find its rhythm, with quite a bit of help from [Loop Engineering](/blog/loop-engineering-test-automation) to get TEs writing native mobile automation they'd never written before. A release matrix is downstream of a team that can actually produce the evidence to fill it. Building the grid in February would have produced a beautiful empty document.

So I get to make the case that the matrix comes first while admitting I built mine second. By the time I sat down with it we'd completed the first few features, and the way the work was lined up we had **several features open simultaneously with a single dev assigned to each.** We were writing test cases, writing automation, and running accessibility reviews across all of them at once, and I was trying to build this artifact on top of upstream steps that weren't finished.

The order I'm advocating for is the order I wish I'd had. What I'd actually claim is narrower and I think more useful: decide the *shape* in discovery, and build it the moment the team can feed it.

## First stop: acceptance criteria

The matrix needs rows, and each row has to be something you can meaningfully call validated or not.

The obvious answer is acceptance criteria. AC is written down, agreed to by product and dev, traceable to the ticket, and nominally what a TE validates against anyway.

I pulled the ACs for the transactions feature: pending and complete transactions, enriched and unenriched data, contacting the vendor, empty states, error states. There were **over a hundred of them for that one feature.**

Put a hundred rows down the left side of a matrix, multiply by your columns, and you have a grid nobody will fill in or read. But volume was the smaller problem. The bigger one is that most of those criteria **aren't about users.** They're about functions and their outputs: this field enriches, this state transitions, this call reaches the vendor. That's correct and necessary, and it is not what a release decision is made of. Nobody holds a launch because a field-level rule is unverified in isolation. They hold launches because someone can't complete a payment.

AC is a function-level correctness contract, and I was trying to use it as a release-level coverage source. Two different altitudes, and the same mistake I made in a different costume in [Coverage Isn't Additive](/blog/ios-coverage-truth), where unit and UI coverage look like they should combine and don't.

AC doesn't get replaced by any of this. Every function a user passes through still has to satisfy its criteria. It just gets *selected over.*

## The attempt that failed, and the reason it did

The right altitude is the user journey. It's the argument I made in [Nobody Trains Test Engineers Like Engineers](/blog/progression-of-automation-thinking), that we should be championing the user and their path rather than validating AC line by line.

So the move was obvious. I had a hundred-plus ACs in a document and I needed the journeys out of them. I wrote several journeys by hand as examples, handed the set to Claude Opus 5, and asked it to deliver the ACs that met those examples.

It returned every acceptance criterion.

I kept at it. Cleaned up the dataset, tightened the constraints, re-shaped the examples. **Failure after failure for a full day** before I stopped. And the thing that finally explained it wasn't the prompt at all.

**The ACs were written in Gherkin.**

That's the whole diagnosis. Gherkin is BDD grammar, Given/When/Then, so every single criterion is already phrased in user-shaped language. It *reads* like a journey. It has an actor, a context, an action, an outcome. Which is precisely why extracting journeys from it looks like a solvable problem, and precisely why it isn't: the format is journey-shaped but the scope is function-level. Half those Given/When/Thens describe something that would make a better unit test.

So a model reading that document has no signal available to separate the ones that are journeys from the ones that are unit tests wearing journey clothes. Both look identical at the grammar level, and the thing that actually distinguishes them, whether a real person moves through this to accomplish something they came here to do, isn't in the document. It's in whoever knows the product.

Handed a corpus where the discriminating information is absent, the model did the only available thing. It returned everything, and let exhaustiveness stand in for judgment.

I should have recognized that faster, because I wrote the same argument from the other end four months ago. In [The DEV:TE Ratio Was Never About Headcount](/blog/dev-te-ratio-ai-era) I argued that a model handed a screen has no idea which of the eleven tappable things a real person would reach for, because that answer doesn't live in the screen. It lives in the person. I thought that was about runtime. It isn't about screens at all. It's about judgment being absent from any artifact you hand a model, and Gherkin is a particularly good disguise for its absence.

## Doing it the way I'd do it manually

What broke the problem open was abandoning extraction and asking how I'd do this by hand, then making that algorithmic.

Four inputs:

- **Doorways:** how many ways are there into this feature?
- **User actions:** what does a person actually do once inside?
- **Screen states:** pending, complete, enriched, unenriched, empty, error
- **Personas:** whose perspective is this journey taken from?

Combine doorways with actions across screen states, per persona. That's it. That's the whole method, and it does the thing the model couldn't. It *selects*, because every one of those four inputs is a judgment about who uses this product and how.

**Over a hundred acceptance criteria became roughly ten test cases.**

Not ten because I lost coverage. Ten because a hundred Gherkin statements about a transactions feature describe maybe ten things a person actually does with transactions, and the other ninety are function-level claims that belong in unit tests, or restatements of a path already counted.

That reduction is the entire value of the exercise, and it took a person a few hours to produce. It could not have been prompted out of the requirements at any price.

## No data to cheat with

On a mature product I could have skipped the judgment. Six months of analytics tell you which flows people use. Escaped-defect history tells you where this team's bugs cluster. A two-year-old regression suite tells you what's fragile. Any of those is a legitimate stand-in. Let the data pick the journeys and it'll do a decent job.

Greenfield has none of it. No analytics, because there are no users. No escaped defects, because nothing has escaped. No regression history, because there's no regression suite. Every empirical signal that would normally rank your work is missing at once.

So human judgment isn't the preferred input here. It's the only one. That's why the extraction was never going to work, and it's why this has to happen in discovery rather than at the end. There's nothing to mine, so somebody has to decide, and the decision has to land somewhere durable enough to survive six months of development.

## Where it lands: three buckets in Xray

The matrix is taking shape in Xray, organized into three buckets.

**Core Regression** is what we own and what carries customer value, sorted by feature and split into manual and automated. A case starts in manual. When it gets automated it moves. That migration *is* the progress metric. The boundary between those two columns is the honest picture of how much of this launch still depends on a person having a free afternoon.

**Extended Regression** holds two things: user journeys we don't own in the native mobile apps, and cases worth remembering that provide little customer value on their own, like caching every endpoint and confirming we don't refresh. Real, worth having written down, not worth a human's launch week.

**Backlog** is test cases for features that don't exist yet. As a feature gets developed, its cases move up into Core. That's what makes the thing a standing structure instead of a snapshot: the matrix already contains the shape of work that hasn't started.

What's still missing is tagging. The cases need tags before I can fix reporting from SauceLabs back into Xray, and until that's done the automated column can't populate itself. Once it does, **launch is launching the UI test job and walking through the manual tests in a test plan.** Not assembling evidence under deadline, just reading a result that's been accumulating for months.

## What I'd do differently on the input

One more thing came out of that wasted day. I tried the same problem against Gemini with a much smaller dataset and got a noticeably better attempt, which points at the real fix not being a better prompt or a better model, but a **smaller, better-scoped input.**

Thousands of lines of AC is the wrong thing to hand any model. The app is the better source, and there's a natural way to scope it: our branch names carry the Jira ticket number, so the feature branch work itself isolates what changed for a given ticket. Point the analysis at that instead of the requirements document and you're asking a question about something concrete, rather than asking for judgment that was never written down.

I haven't built that yet. It's where I'd go next, and it's the same instinct behind [Loop Engineering](/blog/loop-engineering-test-automation): the gains come from shrinking what you hand the model, not from asking it more nicely.

## What this is all in service of

AI is putting enormous pressure on this team to manually validate everything, which is the problem I've been circling for months now. Every reliable skill I build is an attempt to buy back the hours that pressure takes.

Here's what the matrix buys. Once journeys are the organizing unit and the cases underneath them are written to be automated rather than translated into automation later, the automated column takes the breadth: the wide, repetitive validation across states and platforms that no person should spend launch week on.

That frees the humans for the two places on this product where a defect is unrecoverable, **authentication and payments.** There's a home screen in the entry path, but functionally it's a launch pad into payments. Those are the flows that get deep, careful, exploratory human attention, and everything else gets validated by something that runs identically every time at no marginal cost.

That's the same argument I made in [39 releases without a critical bug](/blog/zero-critical-bugs): concentrate human effort on auth and payment paths. The difference is that I'm no longer asking for that focus to be achieved through discipline at the end. The structure produces it.

## Closing

I didn't come up with "quality factory." A stakeholder said it after we shipped 39 releases without a single escape, and he meant something specific by it. We're contractors. We stay as long as the contracts renew, and he wanted to make sure we did whatever knowledge transfer was necessary to keep the QA factory humming after we weren't there to hum it ourselves.

That's stuck with me, because it's the real test of everything above. A pile of artifacts produced on request walks out the door with the person who produced them. A structure is still standing when the contract ends: journeys chosen deliberately, cases that carry them, buckets that sort themselves, a matrix that reads out of the work instead of being assembled on top of it.

Producing artifacts on request is a job I was good at, and every launch week still paid the same tax of stitching them together under a deadline. The thing nobody taught me is that the artifacts were never the deliverable. The connections are.

Six months out, that's the bet: spend the hours on the judgment, once, and let the factory spend the rest.
