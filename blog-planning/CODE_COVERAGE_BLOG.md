# Code Coverage Blog — Context & Source Material

**Status:** Draft at `src/content/blog/ios-coverage-truth.md` — written, numbers verified, untracked and unpublished
**Subject:** EcoJournal (SwiftUI iOS app) — `~/iOSProjects/ecojournal-ios`
**Series:** Mobile Testing, `seriesOrder: 3` (follows `android-testing-best-practices.md` #1, `zero-critical-bugs.md` #2)

This file exists so the blog work can continue in a fresh session without the
originating conversation. Everything below is either verified or explicitly
flagged as needing re-verification.

---

## ✅ Numbers verified 2026-08-01 — all three from the same commit

Measured at `6c3140e`, which matters for this post specifically: the arithmetic
in the "not additive" section only holds if the components and the union come
from one code state. Mixing measurement points would undercut the thesis.

| Suite | Coverage | Lines | Tests |
|---|---|---|---|
| Unit only | **41.10%** | 6,402 / 15,577 | 270 passing |
| UI only | **50.27%** | 7,830 / 15,577 | 53 passing, 3 skipped |
| **Combined (union)** | **62.64%** | 9,757 / 15,577 | **326 total, 323 passing, 3 skipped, 0 failing** |

41.10 + 50.27 = 91.37, union = 62.64 → a **29-point** overlap. Unit 270 + UI 56
= 326 combined, so the counts reconcile too.

Re-verify if any test lands after `6c3140e`.

**How to re-measure:**

```bash
cd ~/iOSProjects/ecojournal-ios
xcodebuild test -scheme EcoJournal -testPlan EcoJournalCombinedCoverage \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -resultBundlePath coverage/x.xcresult -enableCodeCoverage YES
xcrun xccov view --report --json coverage/x.xcresult | python3 -c "
import json,sys
d=json.load(sys.stdin)
for t in d.get('targets',[]):
    if t.get('name','').endswith('.xctest'): continue
    c=t.get('coveredLines',0); e=t.get('executableLines',0)
    print('%d/%d = %.2f%%'%(c,e,c/e*100))"
```

**Known counting trap:** `grep -c "Test case .* passed"` over the log
over-counts, because Swift Testing parameterized tests emit one line per
argument set. Take counts from the result bundle via `xcresulttool`, not grep.
This was the source of an earlier 269-vs-248 confusion; the real figures are
270 unit test cases and 326 combined.

---

## The origin story — this is the spine

The 85% figure did not come from a stale spreadsheet. **An AI agent reported
it.** The app was built with AI assistance; the agent said 85%+ coverage; that
went onto the project page and into an earlier post in good faith. The first
real single-pass measurement said **24.36%**.

In the author's words:

> "My time in the military really triggers me when I get a false report.
> Getting told 85% by an agent and finding out we were really at 24% really set
> me off on a mission to improve coverage in a meaningful way, backed by
> reproducible metrics rather than faith in a tool that is better than any
> conman with just how boldly it lies with confidence."

**Handling notes:**
- The military framing is emotional weight, not a war story. Light touch.
- **Do not invent any specifics** about his service — branch, role, dates,
  deployments. The quote above is the entire supply of material.
- "Better than any conman with just how boldly it lies with confidence" is his
  line and the best sentence in the raw material.
- **Keep the nuance.** This is not an anti-AI post. He built the app with AI and
  used it throughout this effort. The argument is narrower: a confident answer
  is not a measured answer, and the fix is not to stop using the tool but to
  build the instrument that can contradict it.

---

## The three technical moves

### 1. Unit and UI coverage are not additive

41.10% + 50.27% = 91.37%, but the measured union was 62.64%. The ~29-point gap
is code both suites touch.

On Apple platforms, coverage counters are compiled into the **app binary**, so
it makes no difference whether a unit test or a UI test caused a line to run —
both tick the same counter. The only honest figure is the union, measured in one
pass over one instrumented build. That is what
`EcoJournalCombinedCoverage.xctestplan` exists for.

### 2. An Android instinct misleads you on SwiftUI

- On Android, JaCoCo picks up JVM unit tests for free, while Espresso coverage
  needs plumbing most teams never wire up — so "coverage" quietly comes to mean
  "unit coverage."
- Bigger: Android UI is **XML layouts**, which are not code and never enter the
  denominator. In SwiftUI, `var body: some View` is a computed property full of
  executable lines — `LogDetailView` alone is **1,350** — and a unit test cannot
  render a view.
- Net: Apple puts your entire UI in the denominator and hands you one *first-party*
  tool that reaches it (XCUITest). **Careful:** an early draft claimed a hard
  unit-only ceiling "around 40%", which the final unit-only figure of 41.10%
  contradicts. The ceiling is a property of the tooling, not the platform —
  ViewInspector is exactly what breaks it, by rendering real view structs from
  the unit target. Phrase any ceiling claim as first-party-only.

### 3. Coverage comes from execution, not assertions

An `XCTAssert` runs *test* code, not app code. Accessibility identifiers only
let you *find* an element. What moves the number: arriving at a screen, reaching
each conditional branch, firing each action closure.

---

## The best exhibit — a natural experiment

Two files, same codebase, nearly identical size:

| | LogsListView | DashboardView |
|---|---|---|
| Executable lines | 1,311 | 1,134 |
| Active UI tests | 1 | 13 |
| Functions executed | 6 of 89 | 55 of 84 |
| Coverage | **6.4%** | **76.0%** |

Nobody wrote better assertions for Dashboard. It got *visited* more.

---

## Component-level movement

| File | Before | After |
|---|---|---|
| `AudioRecorderService` | 0% | 76.2% |
| `AudioTranscriptionService` | 0% | 45.4% |
| `NewLogViewModel` | 20.19% | 96.9% |
| `EditLogView` | 0% | 88.3% |
| `LogDetailView` | 0% | 67.3% |
| `GPSTelemetryCard` | 0% | 80.0% (ViewInspector alone) |
| `MapViewModel` (extracted) | n/a | 100% |
| `WeatherDataCard` | 0% | 64.4% (ViewInspector alone) |

---

## War stories

- **16 UI tests were commented out** under a TODO blaming "GPS/location services
  which don't work reliably in UI tests." Wrong diagnosis. The real blockers
  were the infrastructure defects below.
- **SwiftUI decides which element type your identifier lands on.**
  `app.maps["map.mapView"]` matched nothing — SwiftUI put the identifier on a
  wrapping `Other`, with the real `Map` as an unidentified child. Found by
  dumping `app.debugDescription`. That dump also showed annotations labeled
  'Pacific Place', 'Nordstrom', 'Westlake' — real downtown Seattle landmarks,
  which independently proved the seeded coordinates were working. The app was
  never broken; the query was.
- **`EditLogView` had an identifiers enum with 8 constants and applied zero of
  them.** The robot had been written against identifiers that existed only in an
  enum. Once applied: 0% → 88.3% from six tests.
- **One dangling `ModelContainer` presented as 16 unrelated failures.**
  `ModelContext` does not keep its container alive; once released, the context
  and every model become invalid and SwiftData traps inside *ordinary property
  getters*. The tell: all 16 reported `0.000 seconds`, meaning they never ran.
- **Unit tests run inside the app.** `TEST_HOST` points at the app binary;
  the bundle installs to `EcoJournal.app/PlugIns/`. A startup failure
  masquerades as "Simulator device failed to launch."
- **A 7-character fixture password against an 8-character minimum.** Unlock
  stayed disabled, the tap was a silent no-op, and it surfaced downstream as
  "the prompt didn't dismiss."
- **The hemisphere bug — the best argument for the whole exercise.** A component
  test asserting on rendered coordinates surfaced that `HeroPhotoSection`
  hardcoded `"%.4f° N, %.4f° W"` with `abs()`. Sydney (-33.8688, 151.2093)
  displayed as "33.8688° N, 151.2093° W" — wrong hemisphere on both axes,
  pointing at the North Atlantic. For a field-research app whose purpose is
  recording *where* you saw something, that is serious.
- **Author's own misdiagnoses** (worth keeping — the post is more credible for
  them): he first "fixed" a duplicate-relationship bug in `saveLog()` that did
  not exist, then reverted after testing disproved it. And he committed two
  component tests without running them; both failed, because they asserted
  things the views never render (`WeatherDataCard` never displays the weather
  condition as text — it only drives an icon and gradient).

---

## The reusable framework

| Code shape | Tool | Why |
|---|---|---|
| Leaf component with a state matrix | ViewInspector | Exhaustive, milliseconds, no identifiers or robots needed |
| Screen, navigation, wiring | XCUITest journey | The only thing that catches assembly bugs |
| Business logic | View model + unit test | Fastest, most durable |
| Hardware boundary | Protocol seam + fake | Accept the thin adapter sitting at 0% |

Supporting techniques:

- **Seams.** `AudioRecorderService` went 0% → 76.2% by putting AVFoundation
  behind protocols and injecting fakes — the pattern the codebase already used
  for `URLSession`. Default arguments build the real objects, so no call site
  changed.
- **Fixture shape.** UI fixtures could only set a log's title and notes, so
  branches like `if let weather`, `if hasGPSData`, `if !log.audioMemos.isEmpty`
  were unreachable *no matter how many tests you wrote*. Enriching the fixture
  unlocked the view bodies. Reaching a screen is step one; reaching each *state*
  is where the coverage lives.
- **ViewInspector** (third-party, exercises the real production view structs)
  took unit-only from 17.78% → 26.91% (and higher as the pattern spread) with a handful of tests, reaching states a
  journey realistically cannot: an error banner, a mid-flight spinner, a nested
  air-quality branch that would otherwise need live API data. Caveat: it tests
  the view, not the assembly — it would not have caught any of the wiring bugs
  above.

---

## Honesty thread

- Three tests are skipped with written reasons rather than forced green: two
  need a simulated location plus permission handling, one drives a chevron
  removed from the view and never re-implemented.
- Camera and mic paths are genuinely out of reach in a simulator. A real device
  makes them *possible but flaky* — and a flaky test is worse than an uncovered
  line.
- Some code is *supposed* to sit at 0%: the thin adapters that only run against
  real hardware (`AudioEngine`, `SpeechAuthorization`). Manual verification is
  their coverage, by design.
- Realistic ceiling for this app is ~70–75%. Chasing 85% would mean testing
  Apple's frameworks rather than our own code.

---

## Outstanding work before/with publication

1. **Re-measure and update every number** (see top of file).
2. **Correct the stale 85% claim in three places** — publishing a post about
   being burned by a false report, next to a page still displaying the false
   report, undercuts the piece:
   - `src/pages/projects.astro:56` — "85%+"
   - `src/pages/projects/ecojournal.astro:49` — "85%+ test coverage · 105
     automated tests" (test count also stale)
   - `src/content/blog/ios-app-4-weeks.md` lines 19 and 65
3. **Decide** whether `ios-app-4-weeks.md` gets an inline correction note
   linking forward to this post, or a silent number fix. An explicit correction
   is more consistent with the post's argument.
4. Commit the post (currently untracked).

---

## Source material in the app repo

- `docs/testing/COVERAGE_IMPROVEMENT_PLAN.md` — phases, harness gotchas, tool
  selection rule, remaining targets. The technical spine.
- `docs/testing/TESTING_STRATEGY.md`
- `git log --format='%h %s%n%b' 9bd8aef..HEAD` — 17 commits written to explain
  *why*, not just what.
