---
title: "A SQL brain in a Swift world"
description: "Thinking in sets made me a better iOS developer, mostly by making me suspicious of loops."
pubDate: 2026-03-18
tags: ["swift", "databases"]
---

Before iOS I spent a long time writing queries. The habit that carried over best was not
syntax — it was the instinct to describe *what* I want rather than *how* to walk to it.

Consider filtering a collection of workouts down to personal records per exercise. The loop
version is the one that comes out of my fingers first:

```swift
var best: [String: Workout] = [:]
for w in workouts {
    if let current = best[w.exercise], current.weight >= w.weight { continue }
    best[w.exercise] = w
}
```

That is a `GROUP BY exercise` with a `MAX(weight)` wearing a costume. Naming it that way
makes the edge cases obvious: what happens on ties? What about an empty set? SQL forced me
to answer those questions every time, and Swift lets me skip them.

## Where the analogy holds

- `filter` is `WHERE`
- `map` is the projection list
- `sorted(by:)` is `ORDER BY`
- `Dictionary(grouping:by:)` is `GROUP BY`
- `reduce` is your aggregate function, for better or worse

## Where it breaks

SQL is declarative because the planner is allowed to reorder your work. Swift is not — a
`filter` followed by a `map` really does allocate an intermediate array unless you reach for
`lazy`. Thinking in sets is good for correctness and occasionally bad for allocations, and on
a phone that difference shows up in a scroll view.

The useful version of the habit, then: describe the query first, then decide how much of the
declarative version you can afford.
