---
title: "AI Mentorship: How I'm Building A1Fit"
date: 2026-07-17
category: "AI-Assisted Development"
tags: ["Testing", "AI", "Claude", "Career", "Mobile"]
readingTime: 8
excerpt: "After building EcoJournal for my wife with Claude I had a startling revelation when going back to add a feature - I had no clue what the AI had built. I had tested it, defined the requirements, completed the spikes to understand the requirements and limitations but I did not understand the view models, Swift Data classes, and the state management system"
status: "PUBLISHED"
order: 4
---

After building EcoJournal for my wife with Claude I had a startling revelation when going back to add a feature - I had no clue what the AI had built. I had tested it, defined the requirements, completed the spikes to understand the requirements and limitations but I did not understand the view models, Swift Data classes, and the state management system.

I learned AI will ship quickly but it comes at the cost of understanding:

- how the framework works under the hood
- the reasoning and logic behind the architecture decisions
- how to maintain and debug the code when things go wrong

The same challenges I faced in EcoJournal followed me to my next project at work: developers were shipping quickly but did not understand the code they were shipping and worst of all, didn't test the AI output but that's another blog.

This one is about me wanting claw back some of that understanding and how I used AI to help me get there

---

## The Trap of the "Four-Weekend App"

When I first started using generative AI tools, I did what most people do: I prompted an LLM to build a feature, copied the output, and pasted it into Xcode.

Next, I started context engineering. I'd give the AI as much context as possible when building out a feature in EcoJournal. I had AI create a markdown doc for every feature and mapping out the plan to build and test it.

Within four weekends, I had built **EcoJournal**, an offline-first iOS field journal app for my wife. On the screen, it was a triumph. The UI was gorgeous, the navigation was slick, and observations mapped to coordinates effortlessly. But under the hood? It was a house of cards. I had no muscle memory of the codebase, no concept of the structural layers, and no idea where to start debugging. I had optimized for speed, but bypassed the learning. It was a great lesson in the importance of understanding your code and the importance of challenging your AI's output; without friction there is no learning.

---

## The Learning Loop: AI prompting me to build the next feature and reviewing my work

For my next project, a gamified diabetes tracker named **A1Fit**, I overhauled my methodology. I implemented a high-discipline learning loop:

1. **AI as the Designer and Mentor:** This time I used Gemini to help me create markdown docs for the features within the app and create the designs with stitch. For each feature I defined the requirements and did the spikes leveraging Gemini to help me understand the best freemium tools I could leverage to deliver on the requirements. After that, it basically served as the Tech Leader and Product Owner, driving me through feature development.
2. **The Twist (No Copy-Pasting):** AI was no longer allowed to write code. Furthermore, it could me the vague requirements we're fond of seeing in Jira tickets and it was on me to devvelop the feature. When I got stuck, I'd use it like a spotter at the gym and scope my prompts just enough to help me past a blocker. This worked rather well about 60% of the time the other 40% it would just start writing code regardless of my prompt and its implementations lacked intent.  
3. **Conceptual Audits:** Its easy to say something like "implement a local database for offline support" but what does that actually mean, how do you handle that for a production app? This is where I'd leverage the AI to provide context; my goal wasn't just to believe that AI but tie it official documentation and best practices.
4. **The QA Gate:** All the lessons learned from EcoJournal were implemented: pre-push hooks, linting, unit and UI testing. I debated integration testing with robolectric but the benefits of instrumented tests outweighed the speed of robolectric and I found it was a better way to test the app from the users perspective.

Manally typing code wasn't too bad. Yes, it was slower but I was able to get into a zone where I was thinking deeply about the problem and come up with creative solutions that may not have come up if I was just copy pasting or letting the AI drive. It also gave me the added benefit of having a much better understanding of the codebase. When you hand type the code you are forced to understand the code. When you AI generate code you can get away with not understanding the code but compiler errors and app crashes create friction points that reinforce learning.

By typing this out line-by-line, the lightbulb finally went off:

- **Dependency Injection (DI)** wasn't just a tool to swap mock services during automated UI testing. It was a constructor-injection paradigm that kept class responsibilities clean and isolated.
- **The Repository Pattern** wasn't just an academic abstraction. It was a gatekeeper separating the presentation layer from the details of the database (Room/SQLDelight) and network (Retrofit/Ktor), allowing us to handle failure states gracefully before they crash the UI.

---

## How a QA Mindset Transforms Architecture

When most developers write code, they focus on the "Happy Path"—the sequence of actions where everything goes right. They build beautiful forms that assume perfect inputs, fast networks, and cooperative databases.

As a Test Engineer, my mind is wired to think in **Unhappy Paths**. I instantly see the edge cases, the race conditions, and the platform limitations:

- What if we need the database to change, how do we prevent breaking changes for existing users?
- What if the user updates the app or changes phones how do we handle data migration?
- How does the app state recover if background permissions are revoked?

When I write code, this QA bias dictates the architecture. I design layers with clean boundaries because I know exactly how I need to isolate them during unit testing. I write robust error-routing because I've seen too many apps crash from uncaught network exceptions or database locks.

---

## Current Progress

Two weekends into the journey and I've managed to build out the data layer and repository for A1Fit. The bottom nav bar is up and running with place holder screens and UI tests are helping me cover navigation. The developers at work would probably say why bother but my velocity ensures this coverage will be around for a bit. I think this scales because if I ever decide to let Ai help I definitely want guard rails in place to keep it from regressing and breaking things.
