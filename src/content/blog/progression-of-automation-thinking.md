---
title: "Nobody Trains Test Engineers Like Engineers"
date: 2026-07-30
category: "Testing & Quality"
tags: ["Testing", "AI", "Automation", "Architecture", "Leadership"]
readingTime: 8
excerpt: "Nobody walks a TE through clean architecture, SOLID, or separation of concerns the way we train software engineers — so most test automation ends up with the same organizational sins dev code used to have. This is the story of how chasing coverage numbers led me to Clean Code and Clean Architecture, why I stopped treating AC as the target and started building around user journeys instead, and how interceptors and AI-as-mentor are where that thinking landed."
takeaway: "Knowing where to test matters as much as knowing what and how — and most of us in test never got taught the engineering fundamentals to know the difference."
status: "LATEST"
order: 9
featured: true
featuredOrder: 2
---

Starting out, I was like any junior: reading and writing code was the high, and completing tickets was a badge of honor. My first real contribution was raising automated regression coverage on a weather app from about 20% to 53% — it could have gone higher, but we weren't leveraging mocks. From there I started thinking about how to push overall coverage further; 53% felt too low, so when I onboarded onto my next project, a travel booking app, I went looking for the actual engineering answers: IdlingResources, annotations, the mechanics underneath the tests. That was the first hint toward real engineering. I was writing Espresso classes for things Google itself was already deprioritizing, with the Compose alpha looming.

## Nobody trains TEs like engineers

In my experience, we don't train QA, SDET, and TEs the way we train software engineers. Nobody sits a TE down and walks through the layers of clean architecture, separation of concerns, SOLID principles. That probably helps you find more bugs on raw instinct, but in practice it means you're often looking everywhere, when you could be looking somewhere specific — at the errors that are actually critical, and actually likely.

The moment that crystallized for me was a coffee app. A small TE team was struggling to maintain meaningful coverage against a dev team that was reusing code and flying on established patterns. Watching that, it hit me: why not use the same kind of patterns for the test suite? From there it was a slog — converting everything we did into some kind of repeatable process with real feedback loops, so we could keep iterating toward whatever the best process actually was for that project.

## Why organization matters

Why feedback loops, why patterns, why process at all? One reason: organization. A codebase is millions of lines of code. It needs to be readable — even in the age of AI, maybe especially in the age of AI — it needs to be easy to change, it needs to align semantically so nobody's carrying more cognitive overhead in their head than they have to, and it needs to be idiomatic. Layering the code provides that organization. Aligning to semantics provides it too. So does staying idiomatic, because fighting platform convention is just a blinking red flag to anyone entrenched in that framework — you end up fighting the very thing the platform was designed to make easy.

## Learning the fundamentals

That line of thinking led me to *Clean Code*, *Clean Architecture*, *The Unicorn Project*, *The Phoenix Project*, *The Pragmatic Programmer*, *Design Patterns*, and whatever mobile-framework books I could find: trying to actually understand the fundamentals of the space I'd ended up specializing in. Once I had that lens, I turned it on my own test automation and didn't love what I saw: repeated code, relaxed separation of concerns, a straight violation of dependency inversion. Worse, most of my suites weren't actually testable from a TE's own perspective.

## AC is not the point — the journey is

QA, SDET, TEs should care about acceptance criteria, but we should be championing the user and their journey. I say that because the test cases in a real regression suite are driven by actual user journeys and flows, not by a checklist. If you're validating AC line by line every regression cycle, I feel sorry for the hundreds of tests you're running per feature.

This is worth pushing on, because a lot of people cling to the phrase "end to end" like it's as immutable as the sun. Your team is only building a certain part of the software.

## What your client actually needs to know

Picture the layers stacked on top of each other:

![Client apps connect to a backend, which connects to a pile of other services](/images/client-backend-layers.svg)

Look at that stack and you'll see what I see: your client application is interpreting some package it either GETs or receives back as a response. "What about SDKs integrated directly into the app?" Same idea, one more layer:

![A client app with an embedded SDK still connects to the backend, but the SDK also sends its own payload straight to a third-party service, bypassing the backend entirely](/images/client-sdk-backend-layers.svg)

Yes, we can trace every hop through every dashboard and watch the data land exactly where it's supposed to. The first time, that's worth doing. Every time, it isn't. We can get equivalent confidence from a fake that talks straight back to the app and lets us delineate every possible user journey, with the backend data mocked to see exactly how the app reacts.

## The WireMock trade-off

So how do you actually get there? The first tool most people reach for is WireMock, and it works — it gives you an accurate happy-path representation of the app. It needs a few tweaks to keep the data modeled correctly over time, but it comes with real problems:

1. Tests get tightly coupled to the data.
2. Platforms get tightly coupled to the data.
3. It doesn't represent every possible scenario a given call can actually return.

That's a win and a loss at the same time. The win: you can make hard assertions about responses, because you control them. The loss shows up the moment an endpoint changes — now you're in problem #2, synchronizing updates across every platform just to keep the pipeline running, and synchronizing anything across platforms is a nightmare; it always costs more time and more people than it looks like it should. And that's before you get to everything else a real endpoint can throw at you: every endpoint can return a failure state your app has to react to, empty states are a real thing too, and unique data sets can trigger genuinely unique UI presentations.

## Where most thought leaders stop

The standard counter-argument is either: don't cover those cases or cover them manually. I can lock in with the best of them — I've powered through 10-plus tickets of manual validation in a day, nitpicking every pixel, every font weight, every accessibility flaw, every payload edge case. But I know, for a fact, that it's impossible to beat a machine at this. Automation will always do it more effectively than a human can.

Here's the part that bothers me: that's where the argument ends for most thought leaders. It goes a lot deeper than that. What you actually want is a unified script or map that shows what can be covered, and what is covered, by your automation. And just as important: there are things you don't want automation covering at all. I don't want to hand a bot end-to-end access to a live credit card to make real payments in production — that was a real proposal from a thought leader at my own company. I don't want to validate that my auth solution actually works based on automation running against fakes. In the end, automation is just code. If we can't write bug-free production code, we definitely can't write bug-free test code.

As a stakeholder in the age of AI slop, I get wanting a human to validate every journey ahead of a product launch. What I don't buy is that the same standard has to hold forever after. Man-hours are the real limiting factor now, and burning days making sure every i is dotted and every t is crossed can just as easily turn into a market loss.

## Where I've landed: interceptors, not mocks

The real fix for WireMock's problems isn't a better mock server — it's not needing one. Interceptors let you proxy the response during the test itself: inject the empty state, the error state, the exact payload you need, right at the point the app receives it, without standing up a second server, maintaining it, or keeping it synchronized across platforms. You're not modeling data ahead of time and hoping it stays current — you're shaping the response in the moment, decoupled from network latency and decoupled from whatever a separately maintained mock definition says. That solves all three of WireMock's problems at once: nothing's coupled to a fixed dataset, nothing needs cross-platform synchronization, and any scenario a real endpoint could return — happy path, failure, empty, edge case — is just another interceptor away instead of another mock to write and keep alive.

None of that was cheap to build by hand. It is now. Code is cheap now, and that's exactly where [Loop Engineering](/blog/loop-engineering-test-automation) comes in — an interceptor-based suite that would have taken weeks to scaffold and maintain by hand is something AI can stand up and keep current in a fraction of the time. I saw the same thing outside of test engineering entirely, building a dumb little [TV remote app](/blog/lost-remote-built-my-own-app) over a weekend — the code was never the bottleneck there either. That's the thread connecting this whole history to where I actually am today.

## The through-thread

Pull all of this apart and there's one thread running underneath every piece of it. Test cases get written so they double as automation from the start, not translated into automation later as a separate task. Regression gets structured so manual review concentrates on the features that are actually critical, while everything else gets the support it needs to be automated properly, instead of skipped or rushed at the end of a sprint. None of that works without one thing underneath it: knowing *where* to test is just as important as knowing what to test and how. That's the piece that gets skipped when nobody teaches TEs to think architecturally in the first place.

Which is why, as a practice, those of us in test need to improve our engineering maturity — not as a nice-to-have, but as the actual precondition for everything above. And this is where I think AI's real value to a TE isn't automation at all. It's that it's a mentor with infinite patience. You can ask it every question, at every level, as many times as you need to, and dive as deep as you actually need to feel confident — not just confident enough to make the ticket move, confident enough to know why the fix works. (I wrote about that side of it more directly in [AI Mentorship](/blog/shift-left-with-ai) if you want the longer version.)

## Closing

There's no one-size-fits-all answer here. Every project carries its own set of constraints — security, technical ability, risk tolerance, how mature the team's test coverage or engineering practice actually is, and a handful of other factors nobody puts on a slide. As Odysseus put it in *Troy* (2004): "We play with the toys the gods give us."
