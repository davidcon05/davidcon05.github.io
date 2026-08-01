---
title: "Coverage Doesn't Add Up: What the Number Actually Measures on a SwiftUI App"
date: 2026-08-01
category: "Testing & Quality"
tags: ["iOS", "SwiftUI", "Testing", "Code Coverage", "XCUITest"]
readingTime: 21
excerpt: "My two test suites reported 41.10% and 50.27% coverage. The real combined figure is 65.17%, not 91.37% — because both suites execute many of the same lines, and on SwiftUI the entire view layer is executable code sitting in the denominator. Here's what actually goes into a coverage number, what happened when I measured mine for the first time and found 24.36% where my own project page claimed 85%, and what raising it to 65.17% cost and caught."
takeaway: "A confident answer is not a measured answer. The fix isn't distrusting the tool — it's building the instrument that can contradict it."
status: "PUBLISHED"
order: 10
series: "Mobile Testing"
seriesOrder: 3
projectUrl: "/projects/ecojournal"
projectName: "EcoJournal"
metrics:
  - label: "Combined Before"
    value: "24.36%"
  - label: "Combined After"
    value: "65.17%"
  - label: "Lines Covered"
    value: "10,150 / 15,575"
  - label: "Tests"
    value: "101 → 328"
  - label: "Bugs Found & Fixed"
    value: "2"
---

A coverage number is a ratio, and it's worth saying out loud what sits on each side of it: executable lines that ran, over executable lines that exist. That's the entire definition. Everything interesting is in what counts as an executable line, and what makes one run.

Unit tests run **logic** lines — view models, services, models, anything a test can call directly.

UI tests run **view-layer** lines. On SwiftUI, that clause is doing an enormous amount of work, because `var body: some View` is a computed property and its contents are executable statements: conditionals, loops, closures. `LogDetailView` in my app is 1,350 executable lines. `MapView` is 1,407. The interface is not markup sitting outside the measurement. It is code, and it is in the denominator.

Now put those two facts together, because this is the part that surprised me. **The two sets overlap.** A line inside a view model runs when a unit test calls it. That same line runs again when a UI test taps through the screen that uses it. Coverage counters are compiled into the app binary, and they do not record *which kind* of test made a line execute. They just increment.

So the numbers cannot be added. On this project:

| Suite | Coverage |
|---|---|
| Unit tests only | 41.10% |
| UI tests only | 50.27% |
| **Measured union** | **65.17%** |

41.10 plus 50.27 is 91.37. The measured union is 65.17. That twenty-six-point gap isn't error bars or approximation — it's the same lines, counted twice by anyone doing the arithmetic. It's a category error, like adding two thermometer readings from opposite ends of the same room and reporting the sum as the temperature.

Two true numbers that produce a false one. And almost nobody notices, because almost nobody measures the union — it takes a test plan holding both targets and a single instrumented pass, while the default path in Xcode hands you the two suites separately and lets you draw your own conclusions.

I drew the wrong one for months.

## Why I went and measured

Until this week, the projects page on this site said EcoJournal had **85%+ test coverage**. I wrote that. I published it in [an earlier post](/blog/ios-app-4-weeks), in good faith, because that is the number my AI agent reported to me.

The first real single-pass measurement came back **24.36%**.

The interesting part isn't that a tool was wrong — tools are wrong constantly. It's that I asked a question, got an answer with a decimal point in it delivered without a flicker of hesitation, and filed it as a fact. Nobody had ever run the measurement. A confident answer and a measured answer are indistinguishable at the moment you receive them, and I spent time in the military, where a false report isn't an embarrassment to be corrected at the next status meeting — it's the kind of thing that gets people hurt. Some part of that never switched off. Finding 24% where I'd published 85% didn't make me want to quietly edit a webpage. It made me want an instrument, because the tool I'd trusted is better than any conman I've met at how boldly it lies with confidence.

This is not an anti-AI post. I built this app with AI and used it throughout the work described here. The claim is narrower and more useful than "don't trust the robot": a confident answer is not a measured answer, and the fix isn't to stop using the tool. It's to build the measurement that's capable of contradicting it.

Here's what a couple of weeks of work produced:

| Measure | Before | After |
|---|---|---|
| **Combined coverage (union)** | **24.36%** | **65.17%** (10,150 / 15,575) |
| Unit tests only | 7.13% | 41.10% |
| UI tests only | 21.12% | 50.27% |
| Unit tests | 77 | 272 |
| UI tests | 24 | 56 |
| **Total tests** | **101** | **328** |
| Real bugs found and fixed | — | **2** |

The two bugs are the part I'd point at if you asked whether any of this was worth doing. Both came out of writing assertions about *rendered output* — the unglamorous kind of test that feels like busywork while you type it. One was a coordinate display that showed an observation recorded in Sydney as sitting in the North Atlantic. The other was a wind speed rendered at roughly a third of its real value. EcoJournal is a field research app; my wife uses it to record where she saw something and what the conditions were. Neither bug crashed anything, neither threw, and both had been shipping for months behind perfectly reasonable-looking numbers. **Formatting and unit conversion are where quiet, plausible wrongness hides**, and the only thing that catches it is a test that asserts on what actually got drawn.

Every figure in this post came out of `xccov`, not out of anyone's assertion, mine included. That habit had to extend to the tooling too: my own coverage script was skipping the integration tests — which are precisely the tests that cover `KeychainManager` — and cheerfully reporting it at 0.5% when the real figure is 79.5%. A script that runs faster by skipping the tests that prove the thing you're measuring isn't fast. It's broken, quickly.

Even counting the tests had a trap in it, which is a small joke at my expense given the subject. My first pass grepped the source and got 358, because some suites carry a Swift Testing `@Test` annotation *and* a function named `testSomething` — one test, counted twice. Grepping the run log instead over-counts in the other direction, since Swift Testing emits a line per argument set for parameterized tests. The **328 tests — 326 passing, 2 skipped, 0 failing** in the table comes from the result bundle via `xcresulttool`, and a corrected source count agrees with it exactly. The same discipline pays off when a run goes red, incidentally — a pile of unrelated failures all reporting `0.000 seconds` isn't sixteen bugs, it's one crash taking the process down and everything still pending with it. Read the durations, not the messages. **Every number in a status report should be able to name the instrument that produced it.**

## Why an Android instinct points the wrong way

I've spent a lot of my career on Android, where "coverage" has a quiet gravitational pull toward one specific meaning. JaCoCo picks up JVM unit tests essentially for free, while getting coverage out of an Espresso run takes plumbing most teams never wire up — so the number that's *easy* to produce becomes the number that gets produced, and over a few years "coverage" comes to mean "unit coverage" without anyone deciding that.

The bigger difference is structural. On Android, a huge share of the UI is XML. Layouts are not code. They never enter the denominator at all. Your `Fragment` has a hundred lines, its layout has four hundred, and coverage only ever asks about the hundred.

SwiftUI inverts that, and a unit test cannot render a view. So Apple puts your entire user interface into the denominator and hands you exactly one first-party tool that can reach it. On a SwiftUI app of any size, unit tests built on first-party tooling alone hit a hard ceiling, and no amount of additional unit testing moves it — the uncovered lines are lines that only execute when something renders them.

Hold onto the phrase *first-party*. It's doing more work in that sentence than it looks like.

None of this is a criticism of SwiftUI. Declarative UI moved logic into the view layer and the measurement followed it there. The instinct that needed to change was mine.

## An accidental controlled experiment

Buried in the report were two files that make the argument better than any explanation I could write. Near-identical in size, both list-ish screens in the same app, written by the same person in the same month:

| | LogsListView | DashboardView |
|---|---|---|
| Executable lines | 1,311 | 1,134 |
| Active UI tests | 1 | 13 |
| Functions executed | 6 of 89 | 55 of 84 |
| **Coverage** | **6.4%** | **76.0%** |

Nobody wrote sharper assertions for `DashboardView`. There's no clever technique in those tests missing from the Logs List one. The tests aren't better.

The screen just got *visited* more.

**Coverage comes from execution, not assertions.** An `XCTAssert` runs *test* code; the app binary's counters don't know an assertion happened. Accessibility identifiers contribute nothing either — an identifier only lets you *find* an element that already rendered. What moves the number is arriving at a screen, reaching each conditional branch inside it, and firing each action closure.

That's a different mental model from unit testing, where "cover this function" and "assert this function is correct" are nearly the same act. In UI testing they come apart completely. You can write a rigorous test that covers almost nothing, and a lazy smoke test that lights up half a file.

## Sixteen tests that were never broken

Sixteen UI tests were sitting in the repo commented out, under a TODO explaining that they depended on "GPS/location services which don't work reliably in UI tests." I'd read that comment before and accepted it. It's plausible. Simulator location genuinely is a pain.

The diagnosis was wrong. I re-enabled all sixteen and read the actual failures instead of the note somebody had left about them. Not one failed because of GPS. Every failure was a defect in the test infrastructure.

The recurring one is worth knowing if you write XCUITests against SwiftUI: **SwiftUI decides which element type your accessibility identifier lands on, and it's frequently not the obvious one.** `app.maps["map.mapView"]` matched nothing, because `Map` puts the identifier on a wrapping `Other` element and leaves the real map as an unidentified child. The metrics panel surfaced as `StaticText`. The search field was *inside* its identified container rather than carrying the identifier itself. Four screens had this same bug in different clothes. The fix was not clever — it was dumping `app.debugDescription` and reading the tree the framework actually built, then looking elements up by identifier across all types.

The dump also settled a question I'd been quietly worried about: the map annotations came back labeled with real downtown Seattle landmarks, exactly where my seeded coordinates said they should be. The app was never broken. The query was.

The other defect was funnier and worse. `EditLogView` had an accessibility-identifiers enum with eight carefully named constants, and applied exactly zero of them to the view. The tests referenced identifiers that existed only in an enum — real Swift symbols that compiled fine, attached to nothing that ever rendered. Applying them took a few minutes and moved `EditLogView` from 0% to **88.3%** off six tests.

I'd like to say I only found that class of mistake in other people's work. I also committed two component tests without running them; both failed, because I'd asserted things the views never render. I had tested my mental model of the view rather than the view. An unrun test isn't a test — it's a hypothesis with good formatting.

## Seeding: start the test where the behavior starts

Re-enabling those tests exposed a deeper limit. The technique that got past it has a name I had to go looking for: **seeding**, or fixture bootstrapping. Rather than driving the UI to build the state a test needs, you preload that state at launch — the test target JSON-encodes fixtures into a launch environment variable, and the app decodes them at startup behind a `--uitesting` flag and writes them into SwiftData. The structural oddity worth knowing is that both targets keep their own structurally identical copy of the seed types: the app and the UI tests are separate processes sharing no Swift types at all, so the JSON shape *is* the contract, and the two copies stay in step by hand.

The disabled tests had built their preconditions by driving the New Log screen, which needs live GPS and a live weather call the simulator won't reliably provide. That, not GPS itself, was the flakiness the TODO was reacting to. They weren't flaky because they *used* location; they were flaky because they *manufactured their fixtures through* it. Seeded state arrives instantly and deterministically, which makes a suite faster and steadier at the same time — a trade you rarely get in one direction. The exception worth stating: don't seed for a test whose subject *is* the creation flow, or you're testing your seeder.

Then the part that actually blocked coverage. The fixture could describe a log's `title` and `notes`. That's it. So no test, however well written, could reach code guarded by:

```swift
if let weather = log.weather { ... }
if hasGPSData { ... }
if !log.audioMemos.isEmpty { ... }
if !log.mediaURLs.isEmpty { ... }
```

Those branches weren't under-tested. They were *unreachable*, structurally, no matter how many tests anyone wrote. Whole sections of the detail, list, and map screens sat behind a conditional the fixture could not satisfy. That's what a real coverage ceiling looks like — not a gap in effort, but a gap in the shape of the data. The fixture now carries coordinates, weather with air quality, media, and audio memos, with archetype helpers so a test can declare the shape of world it needs in one line.

**Reaching a screen is step one. Reaching each *state* of that screen is where the coverage lives.**

There was one more floor under that. Even enriched, the seeded media were *strings* — URLs pointing at files that did not exist, so the gallery had no bytes to draw and the player had no file to open. And it failed politely: a log with broken media still renders the photo section, just empty, so any test asserting "the section exists" passed against fixtures that proved nothing. The seeder now generates a real JPEG and a real AAC `.m4a` at launch, into a directory wiped on every run. `HeroPhotoSection` went **36.1% → 93.7%** on that change alone.

## Seams, fakes, and what a fake costs

Two services sat at a flat 0% and had earned it: `AudioRecorderService` activated a real `AVAudioSession` and microphone, and `AudioTranscriptionService` could raise a system permission dialog and stall the run.

The fix is the oldest one in the book, and the codebase already did it elsewhere — `WeatherService` takes a `URLSessionProtocol` and sits in the 70-90% range as a direct result. Put the boundary behind a protocol, inject a fake, keep the logic. Default arguments build the real system objects, so not a single call site changed. `AudioRecorderService` went **0% → 76.2%**, fully testable without a microphone.

`AudioTranscriptionService` stopped at **45.4%**, on purpose. The remainder is the recognition task itself, and faking it means fabricating an `SFSpeechRecognitionResult`, which has no usable initializer; a double returning no task would leave the continuation waiting forever, hanging the suite rather than failing it. That path stays on device testing — a decision, documented, not an omission.

The doubles that came out of this each exist for a *different* reason, and the reasons are the whole design:

- **`FakeLocationManager`** subclasses the real one and overrides everything reaching CoreLocation. The reason is sharper than "location is slow": the real `LocationManager` builds a `CLLocationManager` in its initializer, so merely *constructing* one in a test touches the system.
- **The weather and air-quality mocks** return canned data, fail on demand, or — the important one — **hang** on demand. Being able to hang a dependency deliberately is how a ten-second timeout path gets tested in milliseconds. A double that can only succeed or fail cannot exercise the third thing that happens in production, which is nothing happening at all.
- **`FakePhotoStorageService`** is in-memory, because the real one is a singleton writing JPEGs to disk — photo tests were leaving files behind and quietly sharing state with each other.
- **The AVFoundation fakes** substitute the *factory*, not the recorder. Faking the thing that *makes* recorders is what lets `startRecording()` run its real logic without ever activating a session or a microphone.
- **`FakeSpeechAuthorizer`** exists because the real authorization path can raise a system permission dialog and stall the run. A test that stops and waits for a human is not a test.

The principle underneath all of them: **fake at the boundary you don't own.** Every one wraps something Apple ships — CoreLocation, URLSession, the file system, AVFoundation, Speech. None of them fakes the app's own logic, because a fake of your own code is just a second implementation to keep in agreement with the first.

### A fake is code you have to maintain

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

**ViewInspector is for component states in isolation** — and this is where *first-party* comes back, because nothing in Xcode fills this gap. It evaluates a real `body` and lets you walk the result: not a copy of the view redefined in the test target, but the same struct the app renders. To reach a component's error state through a journey, you have to drive the whole app into that state, which is slow when it's possible and frequently isn't. `GPSTelemetryCard` went 0% → **80%** and `WeatherDataCard` 0% → **64.4%** with no UI tests involved at all. Both are pure input-to-render leaves with a state matrix — data, loading, error, empty, plus nested air-quality branches — and a journey only ever samples whichever cell the app happened to be in.

**UI tests are for journeys** — the pathways a user takes *into* a feature and the actions available once there. This is the only instrument that catches assembly bugs: wiring, navigation, identifiers, the difference between a screen that works and a screen you can't get to. Every infrastructure defect in this post was caught by a journey. ViewInspector would have caught none of them, because it never assembles the app.

| Code shape | Tool | Why |
|---|---|---|
| Leaf component with a state matrix | **ViewInspector** | Exhaustive, milliseconds, no identifiers or robots needed |
| Screen, navigation, wiring | **XCUITest journey** | The only thing that catches assembly bugs |
| Business logic | **View model + unit test** | Fastest and most durable |
| Hardware boundary | **Protocol seam + fake** | Accept the thin adapter sitting at 0% |

The corollary: **don't test Apple's frameworks.** Worth asserting about `MapView` — which logs qualify for a pin, what an annotation shows for a given log shape, how the region is computed. Not worth asserting: that MapKit draws a map.

That corollary is a special case of something larger, and it's the idea this whole post has been circling.

## You don't own both ends

We chase end-to-end tests as though "end to end" were an achievable state. For almost everyone it isn't, and the phrase is where the trouble starts: *end to end* implicitly claims you control both ends.

Unless your organization owns every service in the chain, you don't. You're reaching across a network to something that can be rate-limited, deprecated, slow, mid-deploy, or simply down — and none of those outcomes tells you anything about whether your code is correct. You've built a test whose signal is coupled to somebody else's uptime. When it goes red at 2 a.m., the honest reading isn't "the feature broke." It's "something, somewhere, in a chain I don't control, did something." That's not a test result. It's a rumor.

I made a version of this argument in [the Android post](/blog/android-testing-best-practices) — that most enterprise mobile apps are isolated from the data they consume, so their UI tests needn't be end-to-end in the first place. What I didn't do then was follow it down. Abstract away the service, the networking layer, the architecture, and what remains is a function: an input and an output. That's the level at which a test can be *decisive*, where a red result has exactly one interpretation, and that interpretation is "this code is wrong."

Which tells you how a journey should be written. **A journey's job is to prove a user can get into a feature and do the thing.** That's a claim about user paths, not architectural ones. It should not be transitively bound to every layer and service sitting underneath the screen, because each binding is one more way to fail for a reason that has nothing to do with the behavior its name promises.

The cost of getting that wrong isn't annoyance, it's trust, and the chain is worth spelling out. A test coupled to something you don't own fails intermittently. People learn its failures are noise. They stop reading them. Eventually someone disables it to get the build green — reasonably, even, because it *was* noise. And the suite goes right on reporting that the test exists. This is why [I've argued](/blog/zero-critical-bugs) that a flaky test is worse than no test at all: no test is honestly zero, while a flaky one is a false positive wearing a green check.

**The sixteen disabled tests were exactly that decay, every step of it.** They built their state through live GPS and a live weather API — two things this project does not own. Coupling made them unreliable, unreliable made them noise, noise got them commented out, and the coverage claim stayed high while the actual verification quietly left the building. The TODO even blamed the symptom rather than the design decision that caused it.

So the false 85% and the sixteen disabled tests aren't two stories in this post. They're one story from two ends: **tests coupled to things you don't own decay into silence, and silence looks exactly like success.**

Named that way, several earlier decisions stop looking like separate pragmatic calls. Seeding is this principle applied to setup. "Fake at the boundary you don't own" is the same sentence read from the other direction. And to be unambiguous, because it's the easiest thing here to misread: this is not an argument against UI tests. They were the single biggest lever in the entire effort and the only instrument that caught a single wiring bug. **Write journeys through your own code, and cut the dependencies you don't own out of the path.** The journey stays. Its coupling to someone else's uptime is what goes.

## The part where I admit it's a vanity metric

I've spent several thousand words raising a number, so I owe you the other half: the number was never the point, and I know exactly where it stopped being useful.

Code coverage is arbitrary. There's no principled reason 65% beats 62%, and nobody has produced a defensible argument for 80% that isn't a round number somebody liked. It measures execution, not correctness — I could double it tomorrow with tests that assert nothing at all.

The evidence is in the shape of the curve. Getting from **24% to roughly 60%** was almost pure signal: two audio services reaching for hardware, sixteen tests disabled under a wrong diagnosis, a fixture too thin to express a log with weather, eight identifiers applied to nothing. Every one was a real defect in the suite, and clearing them is what surfaced the two real defects in the *app*.

Getting from **60% to 65.17%** took extracting a view model out of `MapView`, building a system to generate valid JPEG and AAC files at runtime, and consolidating two duplicate weather components. Days of work and a lot of creativity for roughly two and a half points. The bugs it found were real, but I was working much harder for much less.

That flattening is itself information, and it's the most practically useful thing the measurement gave me. **A flat curve means the cheap truths are exhausted.** What's left after that is one of three things:

- **Genuinely hard.** `AudioTranscriptionService` stops at 45.4% because faking `SFSpeechRecognitionResult` isn't possible in any honest way.
- **Genuinely not worth it.** The thin adapters whose only job is to call Apple. Covering them means asserting that a function I wrote calls a function Apple wrote; manual verification on a device is their coverage, by design.
- **Genuinely impossible.** The camera. The simulator hasn't got one, and the app is correct not to render the button when `isSourceTypeAvailable(.camera)` is false.

Two UI tests stay skipped with written reasons, because they need a real location fix and a system permission dialog that this environment can't honestly provide. A third used to sit skipped — it drove a chevron removed from the view and never re-implemented — and I deleted it along with the six robot methods supporting it. That deletion is small and it's the most on-thesis decision in the effort. **A permanently skipped test is a claim that something is tested.** It has a name describing behavior, it reads as coverage to anyone scanning the suite, and it executes nothing, forever. That's the same failure mode as the 85%.

Chasing 85% from here wouldn't mean testing my app better. It would mean writing tests against Apple's frameworks so a number on a webpage looks nicer — which is precisely how you end up with a figure that doesn't describe anything real. I'd have arrived back at 85% by a different road, and it would be just as untrue.

## What the number is actually for

Two posts ago in this series I closed [the Android piece](/blog/android-testing-best-practices) with a line I still believe: *coverage numbers don't ship product, confidence does.* On its own that's half an idea. The missing half is that confidence has to be **earned by measurement**. A number you cannot reproduce is somebody's opinion wearing a percent sign, and it doesn't matter whether that somebody is a language model, a stale spreadsheet, or you at 1 a.m. feeling good about your test suite.

Coverage is a terrible grade. It says nothing about whether an assertion is meaningful, whether a journey reflects anything a user does, or whether the executed code is correct. You can hold 85% and ship a screen telling a researcher in Sydney that she's standing in the North Atlantic.

But it's an excellent **map** — not of what you've verified, of where you have never been. It's what told me `LogsListView` had been visited by one test while its twin next door had thirteen. It's what showed two audio services flatlined at zero because they reached straight for hardware. It's what proved the fixture couldn't express a log with weather, which is why four conditionals across three screens had never once executed.

None of those were things I suspected and confirmed. Every one was a thing I'd have sworn was fine — and the 85% report agreed with me, warmly and immediately, which is exactly what made it useless.

That's why the honest 65.17% is worth more than the reported 85%, and it isn't close. The reported number described a feeling and had no way to be wrong out loud. The measured one is a chart with the unexplored regions actually marked, produced by an instrument I can hand to you so you can go get a different answer than mine. You can only sail toward a coastline you've admitted you haven't drawn yet.

The projects page now says 65%, and the old post carries a correction rather than a quiet edit. I'd rather it be reproducible than believed.
