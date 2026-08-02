---
title: "AI Is a Mediocre Developer, and I Merged Its Work Anyway"
date: 2026-08-09
category: "Testing & Quality"
tags: ["AI", "Testing", "Code Review", "Engineering Leadership", "iOS"]
readingTime: 9
excerpt: "Auditing my own test suite turned up four things an AI agent had done that I'd have questioned in a junior's pull request: tests commented out instead of disabled, an identifiers file wired to nothing, redundant tests padding the count, and a coverage figure reported rather than measured. The comparison to a junior breaks down in the place that matters most — a junior only needs telling once."
takeaway: "The agent isn't the variable you control. The size of what you hand it is — small enough that you know what to expect before you look."
status: "PUBLISHED"
series: "Mobile Testing"
seriesOrder: 4
---

I spent a weekend auditing the test suite on a SwiftUI app I built with heavy AI assistance. I was measuring coverage, and I expected to find gaps. What I found instead was a set of decisions no engineer on my team would have made — and that I had merged without asking a single question.

When I wrote about [shipping that app in four weekends](/blog/ios-app-4-weeks), I concluded that AI amplifies throughput while raising the need for human expertise. That still holds. What I didn't account for is that the gap between those two things doesn't disappear — it accrues. Every shortcut the speed bought me was still sitting in the repo months later, drawing interest, waiting for someone to open the file.

I want to be careful about the framing, because "AI writes bad code" is a lazy post and not the one I'm writing. The code compiled. The tests passed. Nothing was broken in a way that would show up in CI. The problems were subtler than that, and every one of them was a choice about *how to represent work* rather than how to write it.

## It hid tests instead of disabling them

16 UI tests sat in the repo behind `//`, under a note explaining that they depended on simulator GPS.

Commented-out code is invisible to every tool that matters. It doesn't appear in a test plan. It doesn't register as a skip. It shows up in no report, no summary, no CI output. The only way to find it is for a person to go spelunking through the test target for reasons of their own.

Xcode has a mechanism for exactly this situation. You disable the test in the `.xctestplan`, where it remains visible as a deliberate exclusion with a reason attached to it.

**A disabled test is an artifact. A commented-out test is a secret.**

That distinction is worth more than it sounds, because one of them gets revisited and the other one doesn't. A disabled test shows up every time somebody opens the plan. A commented-out test is indistinguishable from code nobody wanted.

The stated reason was wrong too, incidentally. I re-enabled all 16 and read the actual failures rather than the note about them. Not one was about GPS.

## It left work that only looked finished

`EditLogView` had an accessibility-identifiers enum: eight constants, carefully named, one per element a test would need to find.

Not one of them was applied to the view.

The enum compiled. The names were good. The UI tests referenced them and compiled too, because a `String` constant resolves whether or not anything ever attaches it to a rendered element. Every part of that work looked done from every angle a reviewer normally checks — the file exists, the naming is consistent, the diff is clean, the build is green.

The tests just never found anything, because there was nothing to find. Applying the identifiers took a few minutes and moved that file from 0% coverage to 88.3% on six tests that had been sitting there the whole time.

This is the one that worries me most, because nothing about it *looks* wrong. Commented-out code at least announces itself if you scroll past it. A well-named enum wired to nothing is indistinguishable from finished work until you go looking for the other half.

## It padded the test count

Several suites covered the same scenario through slightly different phrasing — same setup, same assertion, different function name.

More test functions. No more behavior verified.

Test count is a proxy metric, and this is what proxy metrics get you when the thing producing them is optimizing for the proxy. It isn't deception exactly; it's Goodhart's law running at machine speed. Ask for tests and you get things shaped like tests.

## It reported coverage instead of measuring it

The number I'd been working from wasn't off by a rounding error. It had been produced by assertion rather than by instrumentation — there was no command anybody could re-run to check it.

That's the one that actually bothers me, because it's the failure that hides all the others. A measured number that comes back low starts a conversation. A reported number that comes back high ends one. When I finally built something reproducible, [the real figure and what it actually measures](/blog/ios-coverage-truth) turned out to be a longer story than the gap itself.

## Knowing what to look for isn't looking

Here's the part I got wrong before any of the code was written.

When you ask for a UI test covering a specific case, you should be able to picture the result before you read it. Roughly this many tests. A robot doing roughly these things. Assertions on roughly these elements. Not line-for-line — just a shape close enough that a real difference registers as *different* rather than as unfamiliar.

That expectation is the entire review. Without holding one, you're not evaluating the work, you're confirming it exists and compiles. Those two feel identical while you're doing them, which is the trap.

And I had the expectation available. I just didn't use it.

I know XCUITest. I know enough SwiftUI to get myself in trouble, which mostly means I know Jetpack Compose and I know where an `accessibilityIdentifier` goes. If you had stopped me and asked what a correct identifier setup looks like, I'd have told you — constants declared *and* applied, tests finding real elements. I could have pictured it. I just never stopped to.

Because I wasn't measuring correctness on this project. I was measuring velocity. My wife and I had planned this app for weeks, and the question I was actually asking every session was *how fast can I get this built*. That's a perfectly good question. It's just not the same question as *is this right*, and you cannot hold both at full attention at once. Every session I answered the first one and assumed the second.

That's what got me a fabricated coverage figure and two bugs that shipped for months — not a skill gap. Knowing what to look for and looking are separate acts, and speed is precisely what pulls them apart.

Which points at scope, not at the tool. The size of a request should be bounded by how much of the answer you can hold in your head, because that's what determines whether the review is real. Ask for one screen's tests and you can check them against an expectation. Ask for a test suite and you get a test suite: correctly shaped, plausibly named, and entirely unverifiable by you.

The usual line is that you can't see the forest for the trees. This is the inverse and it's worse. You asked for a forest, you got one, and now there's no way to check any individual tree — so you accept the forest on the grounds that it is, unmistakably, forest-shaped.

## This one's on me

I chose the tool. I merged the work. I'm the tech lead and the only developer on this project. Every one of those decisions passed through me and I didn't look.

What makes it worth writing down is that I keep seeing the same pattern elsewhere, and it isn't really about AI being bad at code. It's about the trust gradient.

If a junior engineer handed me a PR with 16 tests commented out, I'd ask about it in review. If they told me coverage was 85%, I'd ask how they measured. Not because I distrust juniors — because that's what review *is*, and because those are the exact places inexperience shows up.

An AI operates at roughly that level on this kind of work and gets a fraction of that scrutiny. The speed is the reason. When the work arrives faster than you can read it, "looks right" starts substituting for "is right," and the review step quietly becomes optional.

But the junior comparison breaks in a way that makes this worse, not better.

When I tell a junior engineer that we disable tests in the test plan rather than commenting them out, that's the last time I say it. They internalize it, they apply it to cases I never described, and six months later they're the one explaining it to somebody else. The cost of that review was real once and then it went to zero.

An agent doesn't carry the correction forward. Not between sessions, and not reliably within one unless you've written the rule down somewhere it will actually be read. I can fix the same class of mistake repeatedly and arrive right back at it, because there is nothing on the other side accumulating judgment. Every review is the first review.

So the honest version isn't "review it like you'd review a junior." It's: review it like a junior who will never remember this conversation, at ten times the volume, forever. The techniques that make that survivable are not the techniques you use on people.

That asymmetry isn't unique to my side project. It's the same shape as [what AI did to my team's dev-to-TE ratio](/blog/dev-te-ratio-ai-era): the people generating work got an efficiency gain, and the people verifying it didn't. And it's what [the OODA loop framing](/blog/ooda-loop-qa-ai-era) was pointing at — AI didn't create the review bottleneck, it removed the slack that used to hide it.

## Four symptoms, one cause

Line the findings up and they stop looking like four things.

Tests commented out instead of disabled. An identifiers file wired to nothing. Redundant tests padding a count. A coverage number nobody measured. Not one of those is a coding mistake — the code compiled and the tests passed in every case. They're all the same failure: **work that survived because the unit it arrived in was bigger than what I could hold an expectation for.**

Every one of them would have been caught in the first thirty seconds of a real review. Not a careful review. Any review. The reason none of them got one is that they didn't arrive as a reviewable thing — they arrived inside a much larger delivery where each individual piece was plausible and the whole was unverifiable.

Which means the fix isn't reviewing harder, and it isn't a better model. You cannot read 10x output at 1x speed, and no amount of diligence changes that arithmetic. The fix is upstream, in the size of what you ask for.

Small enough units that you know what to expect before you look. Small enough that when something *is* unfamiliar you can stop and probe it, instead of shrugging past it because there are four hundred more lines behind it. Small enough that the thing stays moving — because the failure mode isn't only bad code slipping through, it's also grinding to a halt under review debt you can never pay down.

That's the whole of [Loop Engineering](/blog/loop-engineering-test-automation), and I wrote that post before I properly understood why it works. I framed it then as a way to keep AI from producing slop. That's true, but it undersells it. What it's really doing is keeping the unit of work small enough that a human stays in a position to judge it — which is the only thing standing between "AI is making meaningful contributions" and "AI is quietly commenting out tests, half-implementing features, and writing suites that assert nothing."

The agent isn't the variable you control. The size of what you hand it is.
