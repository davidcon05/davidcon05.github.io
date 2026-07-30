---
title: "I Lost My Remote, So I Built My Own Samsung TV Remote App (The Hard Part Wasn't the Code)"
date: 2026-07-29
category: "AI-Assisted Development"
tags: ["Android", "Kotlin", "Claude", "AI", "Jetpack Compose", "Loop Engineering"]
readingTime: 8
excerpt: "My Samsung remote went missing, and every replacement app in the Play Store wanted an ad slot or a subscription for the privilege of changing the channel. So I built my own. The real story isn't the app — it's that writing code is no longer the hard part; knowing what to build and how to run the AI loop is."
status: "LATEST"
order: 7
featured: true
featuredOrder: 3
takeaway: "Code generation is fast now. The actual skill is knowing precisely what to build next, and disciplining the loop — research, plan, one slice, validate, commit — that keeps the AI pointed at it."
---

My Samsung remote has been missing for about a week now. Nothing dramatic happened to it — nobody threw it, no pet ate it — it just did what small plastic objects do in a house with couch cushions: it vanished. I checked the usual spots, then the unusual ones, and eventually did what everyone does when the physical object is gone. I opened the Play Store to find a replacement.

That's where it fell apart. Every "Samsung TV Remote" app I found wanted something from me in exchange for controlling a TV I already own — a subscription, a one-time unlock fee, or a home screen wrapped in banner ads. I don't fault the developers for that; ads and paywalls are how those apps stay alive. But I wasn't going to pay a recurring fee, or sit through an interstitial ad, just to change the channel.

I kept hunting for the actual remote a while longer, gave up, turned on my PS5, and put a movie on through that instead. Somewhere around the opening credits, I decided I was just going to build the thing myself. Ad-free, no subscription, does exactly what I need and nothing else.

This post isn't really about that app.

## The app is the least interesting part

I built it — a Kotlin and Jetpack Compose Android app called DaveTV that talks to my Samsung TV directly over the local network. It works, and it's mine. But if the whole story were "I got annoyed and built an app," it wouldn't be worth writing down. What's actually stuck with me is how differently this project went compared to how I would have approached it a couple of years ago, and it comes down to one realization: writing the code is no longer the hard part. AI will write it, fast, on request. The hard part — the part that actually determines whether what gets built is any good — is knowing *what* to tell it to write, and structuring the loop so it keeps producing the right thing instead of just *a* thing.

Samsung doesn't publish how their TVs talk to remote-control apps. There's no official spec for the discovery protocol, the pairing handshake, or the command set. That gap is exactly where "just start prompting" falls apart, and where it became obvious what the actual work was going to be.

## Research before a single line of code

Before writing anything, I had Claude spin up parallel background research agents against the undocumented protocol: how SSDP discovery finds the TV on the network, how the WebSocket-based pairing handshake actually negotiates trust, the exact `KEY_*` command codes for input, what a sane persistence design for saved devices looks like, and — critically — a catalog of the real-world edge cases: TV asleep versus TV fully off, the phone on the wrong Wi-Fi network, a pairing token that's been silently revoked, a self-signed TLS cert the OS doesn't trust by default.

None of that got thrown away once I had an answer. It got written up as standing reference docs in the repo, under `docs/research/`, before a single feature file existed. That distinction mattered more than it sounds like it should. The research wasn't a means to an implementation; it was a deliverable in its own right, something I could point back to later when a networking bug showed up and ask "wait, what does the doc say should happen here?"

## Five phases, not vibes

With the research in hand, the next decision wasn't "start coding" — it was how to sequence the work. We broke it into five explicit phases, written down in `docs/phases/`: UI shell first, then the networking core, then app launching over DIAL, then settings and multi-device persistence, then errors and edge cases last.

That ordering was a real decision, made deliberately, not something the AI proposed and I rubber-stamped. UI shell first because I wanted something to look at and react to early. Networking before app launching because launching an app on the TV is meaningless if you can't reliably send it a keypress yet. Errors and edge cases dead last, because you can't meaningfully handle "pairing token revoked" until pairing itself is solid. Getting that sequencing right up front is exactly the kind of judgment call that doesn't show up in a diff.

## A mockup is not a layout

Before any Compose code got written for a screen, I generated UI mockups in Google's Stitch design tool — full HTML and Tailwind exports plus a design-system spec — and handed those to Claude to translate into real Jetpack Compose UI.

Doing it in that order made something clear to me that I'd only understood abstractly before: designing the screen and writing the screen are different skills. Stitch output told me exactly what I wanted — spacing, hierarchy, states, the whole design system — before a single Composable existed. Translating that into idiomatic Compose was comparatively mechanical. The thinking had already happened; the code was just the artifact of a decision that was already made.

## The commit I wasn't allowed to make

Early on, I let Claude get ahead of me. It built one piece, then quietly built the next piece on top of it, and by the time I looked up, it wanted to commit both as one lump. I stopped it. We weren't going to be reckless about this — after each real state of working code, we commit, and only then do we talk about what's next.

So we split that lump back into two properly separated commits, each one tied to a slice of work that had actually been validated on its own. That became the loop for the rest of the project: build one small slice, test it, validate it on a real device or emulator with screenshots to prove it, commit it, and *then* ask whether to push or start the next slice. Nothing skips ahead of that gate. It's a small rule, and it's the entire reason the history of this repo is readable instead of a handful of enormous, unreviewable commits.

> [!TIP]
> The AI didn't need less oversight to move faster. It needed narrower, more frequent checkpoints — a tight loop repeated often, not a long leash and a big review at the end.

## I only own one TV

The original plan scoped multi-device persistence — pairing with more than one Samsung TV — as a normal part of the settings work. Then, while actually planning that phase, the obvious hit me: I own exactly one physical Samsung TV. There was no way to validate multi-device pairing for real, because there was no second device to pair with.

Rather than let Claude build and ship a feature I had no way to actually test, we restructured the roadmap so multi-TV support moved to the very last phase, and built it behind a feature flag so it stays completely inert until I actually own a second TV to validate it against. That's not a limitation I'm working around quietly — it's a constraint I fed back into the plan on purpose. Knowing what I could and couldn't verify in the real world was as much a part of "knowing what to build" as the protocol research was.

## Keep the project on rails

One smaller habit worth mentioning: I asked for explicit progress reporting at every checkpoint — "Phase 2 of 5," not a vague "making good progress." It sounds trivial, but a consistent counter against a plan I'd already agreed to made it obvious, at a glance, whether we were still on the rails I'd laid down or drifting into scope nobody had signed off on.

## What actually got hard

None of the six things above were about writing Kotlin. They were about deciding what needed to be researched before any code existed, how to sequence five phases so each one made the next one possible, recognizing that a design tool and a code generator are solving two different problems, refusing to let validated work pile up into one unreviewable commit, admitting that a feature I couldn't test shouldn't ship yet, and asking for a plain number instead of a vibe. That's the loop. The code was never the bottleneck — it's the part AI is now genuinely good at. What's still entirely on me is knowing what to point it at, and building the review checkpoints tightly enough that it stays pointed there.

I've written about this same idea from the QA side before, in [Loop Engineering](/blog/loop-engineering-test-automation) and [The OODA Loop for QA](/blog/ooda-loop-qa-ai-era) — small, gated loops beat one long, unsupervised prompt, whether what's being built is a test suite or a TV remote. DaveTV just happens to be the version of that lesson where the stakes were "can I change the channel without an ad," instead of a production release.

The remote is still missing, as far as I know. I've stopped looking.
