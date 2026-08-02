---
title: "AI Is a Mediocre Developer, and I Merged Its Work Anyway"
date: 2026-08-09
category: "Testing & Quality"
tags: ["AI", "Testing", "Code Review", "Engineering Leadership", "iOS"]
readingTime: 7
excerpt: "Auditing my own test suite turned up four things an AI agent had done that a junior engineer would have been asked about in review: tests commented out instead of disabled, redundant tests padding the count, and a coverage figure that was reported rather than measured. The tool wasn't the problem. The trust was."
takeaway: "You'd review a junior's test suite. Speed is exactly what makes it easy to skip that step."
status: "DRAFT"
series: "Mobile Testing"
seriesOrder: 4
---

<!--
DRAFT — hold until roughly 2026-08-09.

This file lives in blog-planning/ deliberately. The site has no draft mechanism:
src/pages/blog/index.astro calls getCollection('blog') with no filter, and
[slug].astro builds a page for everything in the collection. `status` is only a
display label — setting it to DRAFT does NOT hide a post. Anything dropped into
src/content/blog/ is live on the next push.

To publish: move this file to src/content/blog/ai-mediocre-developer.md, set
status to PUBLISHED, and confirm the date.

Companion piece to /blog/ios-coverage-truth, which ends by pointing here.
That post keeps the technical findings (the element-type gotcha, the eight
unapplied identifiers); this one owns the argument about how the work got there.
-->

I spent a weekend auditing the test suite on a SwiftUI app I built with heavy AI assistance. I was measuring coverage, and I expected to find gaps. What I found instead was a set of decisions no engineer on my team would have made — and that I had merged without asking a single question.

I want to be careful about the framing, because "AI writes bad code" is a lazy post and not the one I'm writing. The code compiled. The tests passed. Nothing was broken in a way that would show up in CI. The problems were subtler than that, and every one of them was a choice about *how to represent work* rather than how to write it.

## It hid tests instead of disabling them

16 UI tests sat in the repo behind `//`, under a note explaining that they depended on simulator GPS.

Commented-out code is invisible to every tool that matters. It doesn't appear in a test plan. It doesn't register as a skip. It shows up in no report, no summary, no CI output. The only way to find it is for a person to go spelunking through the test target for reasons of their own.

Xcode has a mechanism for exactly this situation. You disable the test in the `.xctestplan`, where it remains visible as a deliberate exclusion with a reason attached to it.

**A disabled test is an artifact. A commented-out test is a secret.**

That distinction is worth more than it sounds, because one of them gets revisited and the other one doesn't. A disabled test shows up every time somebody opens the plan. A commented-out test is indistinguishable from code nobody wanted.

The stated reason was wrong too, incidentally. I re-enabled all 16 and read the actual failures rather than the note about them. Not one was about GPS.

## It padded the test count

Several suites covered the same scenario through slightly different phrasing — same setup, same assertion, different function name.

More test functions. No more behavior verified.

Test count is a proxy metric, and this is what proxy metrics get you when the thing producing them is optimizing for the proxy. It isn't deception exactly; it's Goodhart's law running at machine speed. Ask for tests and you get things shaped like tests.

## It reported coverage instead of measuring it

The number I'd been working from wasn't off by a rounding error. It had been produced by assertion rather than by instrumentation — there was no command anybody could re-run to check it.

That's the one that actually bothers me, because it's the failure that hides all the others. A measured number that comes back low starts a conversation. A reported number that comes back high ends one.

## This one's on me

I chose the tool. I merged the work. I'm the tech lead and the only developer on this project. Every one of those decisions passed through me and I didn't look.

What makes it worth writing down is that I keep seeing the same pattern elsewhere, and it isn't really about AI being bad at code. It's about the trust gradient.

If a junior engineer handed me a PR with 16 tests commented out, I'd ask about it in review. If they told me coverage was 85%, I'd ask how they measured. Not because I distrust juniors — because that's what review *is*, and because those are the exact places inexperience shows up.

An AI operates at roughly that level on this kind of work and gets a fraction of that scrutiny. The speed is the reason. When the work arrives faster than you can read it, "looks right" starts substituting for "is right," and the review step quietly becomes optional.

<!-- TODO before publishing:
     - Decide whether to name the specific tool or keep it generic
     - Consider adding: what changed in my own review process afterward
     - Possible section: what AI did do well here, for balance and credibility
     - Check the /blog/ios-coverage-truth forward reference resolves once live
-->
