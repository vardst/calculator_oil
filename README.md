# Cost Per Mile

A calculator I made because the last time I helped a friend price a haul, we did the math on a napkin three times and got three different answers.

There are two modes. One is for road trips, the kind of thing you fiddle with before driving cross-country with your friends. The other is for owner-operators — the people who actually need to know, with some confidence, what a mile costs them before quoting a load.

It runs entirely in the browser. Nothing gets sent anywhere. It remembers your last inputs, so when fuel prices move you don't start from scratch.

**[Open it →](https://vardst.github.io/calculator_oil/)**

## What's in it

Trip mode covers distance, MPG, fuel price, and the questions people actually have. Does the AC really cost you anything? (Yeah, about 10%.) Does the cooler full of beer in the back matter? (A bit, roughly 1% per 100 lbs.) Splitting fuel with passengers, round trips, EVs with kWh inputs — all there.

Pro mode is the trucking version. Fixed monthly costs (truck, insurance, parking, the whole list), variable per-mile costs, driver pay, deadhead, profit target. Out comes your real break-even and the rate you should be quoting. Everything updates as you type, so you can drag a number around and watch what it does.

Metric or imperial. Dollars, euros, pounds. Dark by default, but there's a light mode if you really want it.

## How it's built

Vite, React, TypeScript, Tailwind v4. A few Radix primitives where building from scratch wasn't worth it. Animations from `motion`. The whole thing is one static bundle deployed to GitHub Pages by a workflow on every push to `main`.

## Where it came from

Started as a typical freelance brief: three inputs, one number out. Those calculators are fine until your situation is even a little specific, and then they're useless. The trick was adding enough inputs to make it genuinely useful without burying anyone under a wall of fields. I think it lands in the right place. Try it and tell me if it doesn't.

## License

MIT.
