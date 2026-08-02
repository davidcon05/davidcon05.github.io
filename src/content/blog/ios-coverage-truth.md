---
title: "Coverage Isn't Additive: What Declarative UI Did to the Number"
date: 2026-08-01
category: "Testing & Quality"
tags: ["iOS", "SwiftUI", "Testing", "Code Coverage", "XCUITest"]
readingTime: 19
excerpt: "A project at work needs 80% coverage, and I assumed UI tests could carry it alone — they execute far more lines per test than unit tests do. Checking that assumption in xccov turned up two things worth knowing: unit and UI coverage measure overlapping sets of the same lines, so they can't be added, and declarative UI changed what a coverage tool can see, what a unit test can reach, and what the report can tell you afterward."
takeaway: "Coverage isn't a bar to clear, it's a map of where your tests have never been. Chase the bar and you optimize the number; read the map and you find the bugs."
status: "PUBLISHED"
order: 10
series: "Mobile Testing"
seriesOrder: 3
projectUrl: "/projects/ecojournal"
projectName: "EcoJournal"
metrics:
  - label: "Coverage Before"
    value: "24.36%"
  - label: "Coverage After"
    value: "65.17%"
  - label: "Lines Covered"
    value: "10,150 / 15,575"
  - label: "Tests"
    value: "101 → 328"
  - label: "Bugs Found & Fixed"
    value: "2"
---

A project at work needs to hit 80% code coverage. There's no derivation behind that figure — it's the number, the way it's always the number.

I've had a hypothesis about that for years: UI tests could carry it alone. A UI test drives the real app through real screens, so it executes far more lines per test than a unit test does. Slower, certainly — but if the goal is lines executed, the slow suite touches more of them. I'd never had the time to prove it.

Then rain washed out a weekend, so I sat down to find out — both whether the hypothesis holds, and what actually goes into a coverage number that's worth trusting.

I ran it on my own project rather than work's — EcoJournal, a SwiftUI field research app, roughly 15,500 executable lines, and I'm the only contributor. One variable at a time, no other hands, results I can actually attribute.

The premise held. UI tests really do cover more here — **50.27% from UI alone against 41.10% from unit alone.** Everything I assumed followed from that was wrong:

- **[Coverage does not add.](#coverage-isnt-additive)** Two suites are not two contributions toward a total. They execute overlapping sets of the same lines, and the tooling will hand you both numbers without ever mentioning it.
- **[Declarative code does not measure like imperative code.](#declarative-ui-changed-what-a-test-can-reach)** SwiftUI changed what the tool can see, what a unit test can reach, and what the report can tell you afterward. Intuitions built on UIKit — or on Android, where I built most of mine — transfer badly.
- **[The split is a property of your architecture, not your framework.](#which-suite-carries-more-is-architectural)** Which suite carries more depends on whether your screens are bespoke or assembled from shared components. Mine are bespoke. Yours may not be.
- **[Coverage comes from execution, not assertions.](#two-screens-same-size-6-vs-76)** Two near-identical screens in this app sit at 6.4% and 76.0%. The tests aren't better on one of them; it just got visited more.

## Coverage isn't additive

| Suite | Coverage |
|---|---|
| Unit tests only | 41.10% |
| UI tests only | 50.27% |
| **Measured union** | **65.17%** |

41.10 plus 50.27 is 91.37. The union is 65.17. That 26-point gap is the same lines, counted twice.

The reason is where the counters live. Coverage instrumentation is compiled into the app binary — a counter sits with the line and increments when the line runs. It has no idea what caused that. A line in a view model ticks when a unit test calls it directly, then ticks again when a UI test taps through the screen that uses it. One line, two suites, one counter. Adding the percentages isn't conservative, it's a category error, like summing two thermometer readings from opposite ends of the same room.

Getting the real figure means putting both targets in one test plan and running a single instrumented pass. That isn't the default path — Xcode will hand you two separate reports and let you draw your own conclusion.

### Which suite carries more is architectural

UI tests cover more *here* because EcoJournal is built from bespoke screens: each one's `body` exists in exactly one place, so only a test that visits it will ever execute those lines. Invert the architecture and the answer inverts. An app on a real component library pays for each component once, and what proliferates instead is the layer deciding what to hand those components — mapping, formatting, conditional presentation — which outnumbers the views and is all directly unit-testable. **The split between your suites is a property of your architecture, not your framework.**

## Declarative UI changed what a test can reach

The claim you hear is that SwiftUI put your UI into the denominator. That's about half true, and the half that matters is different from the half people say.

Storyboards and XIBs are XML — not compiled, never counted. So moving off Interface Builder does enlarge your denominator. Moving from *programmatic* UIKit changes almost nothing, because those views were always Swift. (EcoJournal has no storyboards, so all of its interface is measured.) My Android instincts were miscalibrated the same way: XML layouts are exempt there too, which makes "coverage" quietly mean "unit coverage of everything except the screen."

The real shift is reachability. In UIKit you could unit test view code directly — instantiate the controller, `loadViewIfNeeded()` to run the lifecycle, then assert on `titleLabel.text`. No third-party dependency, no simulator. SwiftUI's `body` returns an opaque `some View`: a value describing what to render, with no first-party API to execute it and inspect the result. There is no `loadViewIfNeeded()`, no `titleLabel`, and no equivalent test. **The view layer went from inspectable to opaque** — which is the entire reason ViewInspector, a library that reflects into SwiftUI's internals, needs to exist. Nobody needed that for UIKit.

Attribution changed too, and it's the part nobody mentions. UIKit coverage names methods you can act on: `viewDidLoad()`, `didTapSave()`. SwiftUI attributes everything to closures inside one computed property — `DashboardView.swift` is 1,134 executable lines reported as 84 entries, most of them `closure #4 in closure #1 in DashboardView.body.getter`. The percentage is trustworthy; the report is a scavenger hunt.

One caveat before the framework argument gets going: the two UIKit bridges in this app, `CameraPickerRepresentable` and `PhotoPickerRepresentable`, sit at a flat 0% because they wrap system pickers a simulator can't run. Some of your interface is unreachable for reasons that predate whichever framework you're defending.

## Two screens, same size, 6% vs 76%

One piece of evidence reframed everything that followed. Buried in the report were two files that make the argument better than any explanation I could write. Near-identical in size, both list-ish screens in the same app, written by me in the same month:

| | LogsListView | DashboardView |
|---|---|---|
| Executable lines | 1,311 | 1,134 |
| Active UI tests | 1 | 13 |
| Functions executed | 6 of 89 | 55 of 84 |
| **Coverage** | **6.4%** | **76.0%** |

The difference isn't assertion quality. I wrote both, and there's no technique in the `DashboardView` tests missing from the other one.

The difference is how far into the screen the tests went. The Logs List had a single test checking the empty state — the surface, the thing you see before you've done anything. `DashboardView` had 13 that followed a user further in: create a journal, and create several; type into search and watch the list filter; open the suggestion dropdown, filter it, check that prefix matches rank first, clear the field and watch it close; pick a suggestion and navigate through; go into a journal and come back. Each of those is a branch, and each branch is lines that only execute when somebody goes there.

**Coverage comes from execution, not assertions.** An `XCTAssert` runs *test* code; the app binary's counters don't know an assertion happened. Accessibility identifiers contribute nothing either — an identifier only lets you *find* an element that already rendered. What moves the number is arriving at a screen, reaching each conditional branch inside it, and firing each action closure.

That is a different mental model from unit testing, where "cover this function" and "assert this function is correct" are nearly the same act. In UI testing they come apart completely. You can write a rigorous test that covers almost nothing, and a lazy smoke test that lights up half a file.

## Seed the state, don't drive the UI to it

Re-enabling those tests exposed a deeper limit, and getting past it is where the real work started.

The technique has a name I had to go looking for: **seeding**, or fixture bootstrapping. Rather than driving the UI to build the state a test needs, you preload that state at launch — the test target JSON-encodes fixtures into a launch environment variable, and the app decodes them at startup behind a `--uitesting` flag and writes them into SwiftData. The structural oddity worth knowing is that both targets keep their own structurally identical copy of the seed types: the app and the UI tests are separate processes sharing no Swift types at all, so the JSON shape *is* the contract, and the two copies stay in step by hand.

The disabled tests had built their preconditions by driving the New Log screen, which needs live GPS and a live weather call the simulator won't reliably provide. That, not GPS itself, was the flakiness the TODO was reacting to. They weren't flaky because they *used* location; they were flaky because they *manufactured their fixtures through* it. Seeded state arrives instantly and deterministically, which makes a suite faster and steadier at the same time — a trade you rarely get in one direction. The exception worth stating: don't seed for a test whose subject *is* the creation flow, or you're testing your seeder.

Then the part that actually blocked coverage. The fixture could describe a log's `title` and `notes`. That's it. So no test, however well written, could reach code guarded by:

```swift
if let weather = log.weather { ... }
if hasGPSData { ... }
if !log.audioMemos.isEmpty { ... }
if !log.mediaURLs.isEmpty { ... }
```

Those branches weren't under-tested. They were *unreachable*, structurally, no matter how many tests anyone wrote. Whole sections of the detail, list, and map screens sat behind a conditional the fixture could not satisfy. That is what a real coverage ceiling looks like — not a gap in effort, but a gap in the shape of the data. The fixture now carries coordinates, weather with air quality, media, and audio memos, with archetype helpers so a test can declare the shape of world it needs in one line.

**Reaching a screen is step one. Reaching each *state* of that screen is where the coverage lives.**

There was one more floor under that. Even enriched, the seeded media were *strings* — URLs pointing at files that did not exist, so the gallery had no bytes to draw and the player had no file to open. And it failed politely: a log with broken media still renders the photo section, just empty, so any test asserting "the section exists" passed against fixtures that proved nothing. The seeder now generates a real JPEG and a real AAC `.m4a` at launch, into a directory wiped on every run. `HeroPhotoSection` went **36.1% → 93.7%** on that change alone.

## Fake at the boundary you don't own

Two services sat at a flat 0% and had earned it: `AudioRecorderService` activated a real `AVAudioSession` and microphone, and `AudioTranscriptionService` could raise a system permission dialog and stall the run.

The fix is the oldest one in the book, and the codebase already did it elsewhere — `WeatherService` takes a `URLSessionProtocol` and sits in the 70-90% range as a direct result. Put the boundary behind a protocol, inject a fake, keep the logic. Default arguments build the real system objects, so not a single call site changed. `AudioRecorderService` went **0% → 76.2%**, fully testable without a microphone.

`AudioTranscriptionService` stopped at **45.4%**, on purpose. The remainder is the recognition task itself, and faking it means fabricating an `SFSpeechRecognitionResult`, which has no usable initializer; a double returning no task would leave the continuation waiting forever, hanging the suite rather than failing it. That path stays on device testing — a decision, documented, not an omission.

The doubles that came out of this each exist for a *different* reason, and the reasons are the whole design:

- **`FakeLocationManager`** subclasses the real one and overrides everything reaching CoreLocation. The reason is sharper than "location is slow": the real `LocationManager` builds a `CLLocationManager` in its initializer, so merely *constructing* one in a test touches the system.
- **The weather and air-quality mocks** return canned data, fail on demand, or — the important one — **hang** on demand. Being able to hang a dependency deliberately is how a 10-second timeout path gets tested in milliseconds. A double that can only succeed or fail cannot exercise the third thing that happens in production, which is nothing happening at all.
- **`FakePhotoStorageService`** is in-memory, because the real one is a singleton writing JPEGs to disk — photo tests were leaving files behind and quietly sharing state with each other.
- **The AVFoundation fakes** substitute the *factory*, not the recorder. Faking the thing that *makes* recorders is what lets `startRecording()` run its real logic without ever activating a session or a microphone.
- **`FakeSpeechAuthorizer`** exists because the real authorization path can raise a system permission dialog and stall the run. A test that stops and waits for a human is not a test.

The principle underneath all of them: **fake at the boundary you don't own.** Every one wraps something Apple ships — CoreLocation, URLSession, the file system, AVFoundation, Speech. None of them fakes the app's own logic, because a fake of your own code is just a second implementation to keep in agreement with the first.

### What a fake costs

I've made that sound cleaner than it is, so let me price it.

A fake is a second implementation. You wrote it, you own it, you maintain it, and it can drift from the thing it stands in for. A fake that has quietly stopped resembling reality is a flaky test pointed the other way — instead of failing for no reason, it passes for no reason. That's a confident green describing behavior that no longer exists, and nobody investigates a green. I'm not going to spend a section recommending a technique and then pretend it can't produce one.

So it's a real cost. The question is what you're paying it *instead of*, and in my experience that's one of three things:

- **Lower environments.** Staging is not production. Data gets reset underneath you mid-run, config drifts, and the behavior you validated may not be the behavior you ship.
- **Shared accounts.** Another team's run mutates the state your assertion depends on. Rate limits are shared too, so your suite's reliability becomes a function of somebody else's schedule.
- **Leased services.** Your enterprise pays for it; it does not own it. Throttling, deprecation, version changes, and downtime all arrive on the vendor's timetable, and no amount of engineering on your side prevents any of them.

Which means this was never a choice between a cost and no cost. It's a choice about **which problem you'd rather have**, and the two are not symmetric.

A fake's drift is local, visible, and fixable. It lives in your repository, it shows up in a pull request where someone can argue with it, and when it's wrong you fix it that afternoon. A shared environment's flakiness is remote and frequently unfixable at any price — you cannot code your way out of another team resetting a database or a vendor throttling your key.

The durations differ too, and that's the part people underweight. A fake is mostly a one-time cost that amortizes across every test that uses it. The external dependency's cost recurs forever, and it gets *worse* as the team grows and more suites contend for the same shared thing.

The discipline that keeps a fake honest: **fake the transport, not the contract.** `WeatherServiceTests` hands its mock session a payload with OpenWeatherMap's actual response shape — the real nesting, the real key names, `weather[0].icon` sitting where the API really puts it — so decoding is verified against the structure the service genuinely receives. Fake the network call, the audio session, the file system. Do not fake the *shape of the data*, because that shape is the part you don't control and therefore the part most likely to break you.

And the gap that remains, stated rather than hidden: no fake can tell you the vendor changed their response shape last Tuesday. The honest mitigation is a small, separate, non-blocking suite that occasionally exercises the real service to confirm the contract still holds, kept deliberately out of the path that gates a merge so somebody else's outage can never block your build. This project doesn't have one yet. I'd rather write that down than let a folder full of fakes imply a guarantee it isn't providing.

## Three instruments, three jobs

By the end I had three ways to execute app code, and the most valuable thing I took from all of this is a clear sense of what each is *for*. They aren't ranked. They answer different questions, and using one to answer another's question is where the hours go.

**Unit tests are for logic.** Fast, durable, no simulator, no rendering. This is where the bugs that matter usually live — the save that drops a relationship, the timeout that never fires, the average that counts a missing reading as zero. If behavior can be expressed as inputs and outputs it belongs here, and pulling it out of a view so it *can* be is usually the right refactor regardless of testing. `NewLogViewModel` went from 20.19% to 96.9% once its logic was somewhere a test could call.

**ViewInspector is for component states in isolation** — the tool that exists because `body` is opaque. It evaluates a real `body` and walks the result: not a copy of the view redefined in the test target, but the same struct the app renders. To reach a component's error state through a journey you have to drive the whole app into that state, which is slow when it's possible and frequently isn't. `GPSTelemetryCard` went 0% → **80%** and `WeatherDataCard` 0% → **64.4%** with no UI tests involved at all. Both are pure input-to-render leaves with a state matrix — data, loading, error, empty, plus nested air-quality branches — and a journey only ever samples whichever cell the app happened to be in.

**UI tests are for journeys** — the pathways a user takes *into* a feature and the actions available once there. This is the only instrument that catches assembly bugs: wiring, navigation, identifiers, the difference between a screen that works and a screen you can't get to. Every infrastructure defect above was caught by a journey. ViewInspector would have caught none of them, because it never assembles the app.

| Code shape | Tool | Why |
|---|---|---|
| Leaf component with a state matrix | **ViewInspector** | Exhaustive, milliseconds, no identifiers or robots needed |
| Screen, navigation, wiring | **XCUITest journey** | The only thing that catches assembly bugs |
| Business logic | **View model + unit test** | Fastest and most durable |
| Hardware boundary | **Protocol seam + fake** | Accept the thin adapter sitting at 0% |

The corollary: **don't test Apple's frameworks.** Worth asserting about `MapView` — which logs qualify for a pin, what an annotation shows for a given log shape, how the region is computed. Not worth asserting: that MapKit draws a map.

That corollary is a special case of something larger.

## Don't couple a test to what you don't own

"End to end" implicitly claims you control both ends, and unless your organization owns every service in the chain, you don't. A test that reaches across a network inherits everything that can happen out there — rate limits, deprecations, deploys, outages — none of which tells you whether your code is correct. When it goes red you don't learn "the feature broke," you learn "something, somewhere, in a chain I don't control, did something." That's a rumor, not a result. Abstract away the service and the networking layer and what remains is a function with an input and an output, which is the level where a red result has exactly one interpretation.

The cost of ignoring that is trust, and it decays in a predictable order:

- A test coupled to something you don't own fails intermittently
- People learn its failures are noise
- They stop reading them
- Someone disables it to get the build green — reasonably, because it *was* noise
- The suite goes on reporting that the test exists

This is why [I've argued](/blog/zero-critical-bugs) a flaky test is worse than no test: no test is honestly zero, while a flaky one is a false positive wearing a green check.

**A journey's job is to prove a user can get into a feature and do the thing.** That's a claim about user paths, not architectural ones. None of which is an argument against UI tests — they were the biggest lever in the whole effort. The journey stays. Its coupling to someone else's uptime is what goes.

## Where I stopped

I stopped at 65.17%. Here is what a couple of weeks produced:

| Measure | Before | After |
|---|---|---|
| **Combined coverage (union)** | **24.36%** | **65.17%** (10,150 / 15,575) |
| Unit tests only | 7.13% | 41.10% |
| UI tests only | 21.12% | 50.27% |
| Unit tests | 77 | 272 |
| UI tests | 24 | 56 |
| **Total tests** | **101** | **328** |
| Real bugs found and fixed | — | **2** |

The two bugs are the part I'd point at if you asked whether any of this was worth doing. Both came out of writing assertions about *rendered output* — the unglamorous kind of test that feels like busywork while you type it. One was a coordinate display that showed an observation recorded in Sydney as sitting in the North Atlantic. The other was a wind speed rendered at roughly a third of its real value. Neither crashed anything, neither threw, and both had been shipping for months behind perfectly reasonable-looking numbers. **Formatting and unit conversion are where quiet, plausible wrongness hides**, and the only thing that catches it is a test that asserts on what actually got drawn.

Now the part I have to be honest about: I didn't reach 80%, and I stopped trying.

The shape of the curve is why. Getting from **24% to roughly 60%** was almost pure signal — two audio services reaching for hardware, a suite of UI tests coupled to services this project doesn't own, a fixture too thin to express a log with weather. Every one was a real defect in the suite, and clearing them is what surfaced the two real defects in the app.

Getting from **60% to 65.17%** took extracting a view model out of `MapView`, building a system to generate valid JPEG and AAC files at runtime, and consolidating two duplicate weather components. A lot of creativity for roughly two and a half points.

That flattening is itself information, and it's the most practically useful thing the measurement gave me. **A flat curve means the cheap truths are exhausted.** What's left after that is one of three things:

- **Genuinely hard.** `AudioTranscriptionService` stops at 45.4% because faking `SFSpeechRecognitionResult` isn't possible in any honest way.
- **Genuinely not worth it.** The thin adapters whose only job is to call Apple. Covering them means asserting that a function I wrote calls a function Apple wrote; manual verification on a device is their coverage, by design.
- **Genuinely impossible.** The camera and photo pickers, sitting at 0 of 25 and 0 of 64 lines, wrapping system UI a simulator cannot run.

So what would reaching 80% actually take? Writing tests against Apple's frameworks and against hardware I can't drive, in order to move a number on a webpage. That isn't a better-tested app. It's a worse-tested app with a nicer number.

## The number was never the thing

Which brings me back to where I started. UI tests really are the heavier contributor on this codebase — that part of my thinking survived contact with the data. What didn't survive was everything I'd built on top of it: that the suites add, that the bigger contributor could reach a target alone, and that any of this generalizes past my own architecture. The premise was fine. The arithmetic around it wasn't.

And the target itself deserves the same scrutiny. **80% is a number somebody made up.** It's a real convention, repeated widely enough to feel like received engineering wisdom, but nobody derived it from anything about *my* codebase, and nobody could. A defensible target would have to know what fraction of my lines are view bodies reachable only through ViewInspector, what fraction are hardware adapters that should sit at 0% by design, and what fraction are system-picker wrappers a simulator will never execute. No industry number knows that. Mine does now, and it took measuring to find out.

Coverage is a terrible grade. It says nothing about whether an assertion is meaningful, whether a journey reflects anything a user does, or whether the executed code is correct. You can hold a very impressive percentage and ship a screen telling a researcher in Sydney that she's standing in the North Atlantic.

But it is an excellent **map** — not of what you've verified, of where you have never been. It's what told me `LogsListView` had been visited by one test while its twin next door had 13. It's what showed two audio services flatlined at zero because they reached straight for hardware. It's what proved the fixture couldn't express a log with weather, which is why four conditionals across three screens had never once executed.

Two posts ago in this series I closed [the Android piece](/blog/android-testing-best-practices) with a line I still believe: *coverage numbers don't ship product, confidence does.* This is the other half of it. Chase a number and you will optimize the number — there is always a cheap line somewhere that moves it, and an AI will find those lines faster than you can review them. Read the map instead and it tells you where you have never been, which is the only place bugs can still be hiding.

I still don't know what good coverage looks like on a SwiftUI app in general. I know what mine is, I know which parts of the remainder are unreachable and why, and I can hand you the command that reproduces every figure in this post. That turned out to be worth considerably more than a percentage.
