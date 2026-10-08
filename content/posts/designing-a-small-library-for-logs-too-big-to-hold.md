---
title: "Designing a small library for logs too big to hold in memory"
date: "2026-09-20"
excerpt: "A take-home brief asked for one function that classifies sensors from a log file. How I approached it as a library: reading the spec for ambiguity, streaming with fixed state, failing loudly, making new sensor types cheap, and the memory bug I only found after submitting."
seoTitle: "Designing a small library for logs too big to hold in memory — Ali Pajand"
seoDescription: "A senior approach to a small TypeScript library: spec ambiguity, streaming parsing with fixed per-sensor state, Welford's algorithm, chunk-boundary tests, fail-fast errors, extensible rules, V8 sliced-string memory retention, and how AI fit into the work."
tags:
  - TypeScript
  - Library design
  - Testing
  - DX
  - AI
---

The brief was small. A company that makes cheap home sensors puts some units in a controlled room and logs their readings. Write a function, `evaluateLogFile(logContentsStr)`, that reads the log and says which thermometers are "ultra precise", "very precise", or "precise", and which humidity and carbon monoxide sensors to keep or discard.

```text
reference 70.0 45.0 6
thermometer temp-1
2007-04-05T22:00 72.4
2007-04-05T22:01 76.0
humidity hum-1
2007-04-05T22:04 45.2
monoxide mon-1
2007-04-05T22:04 5
```

A working answer takes an afternoon: split on newlines, group readings by sensor, compute a mean and a standard deviation, compare. The two lines at the bottom of the brief changed what I was building: production logs are "likely to be very large", and more sensor types, such as a noise detector, are coming. I was also told to treat it as a pull request for a feature I would own afterwards.

So it was not a puzzle. It was a small library that someone would extend and run on files I would never see. That shaped every decision below.

## Read the spec for what it does not say

Before writing code I listed every place the brief left a choice open, because each one silently changes an output.

- **"Within 0.5 degrees."** Inclusive or exclusive? I chose inclusive. A mean exactly 0.5 away passes.
- **"Less than 3" and "under 5."** Strict. A standard deviation of exactly 3 is "very precise", not "ultra precise".
- **Which standard deviation.** Population, dividing by n, because the log holds every reading the unit produced in the test, not a sample of them.
- **Floating point.** `64.4 - 63.9` is `0.5000000000000071` in JavaScript. Without a tolerance, a thermometer whose mean is exactly on the boundary fails because of how doubles are stored, not because of the sensor. Comparisons allow `1e-9` of error, in one helper, so the tolerance has one home.
- **"All carbon monoxide readings are integers."** I accepted decimals and classified them the same way. Rejecting `6.0` would be strict without protecting anything.
- **Timestamps.** They must look like ISO 8601, but no rule depends on them, so they are validated and otherwise ignored.

None of these are hard. The point is that each is written down in the README's assumptions section and pinned by a test at the exact boundary. A reviewer can disagree with a choice, but cannot be surprised by one.

## The shape: a parser that routes, rules that decide

The design is a split between two responsibilities that change for different reasons.

The **parser** understands the log format. It finds lines, validates them, tracks which sensor is current, and routes each reading to it. It changes when the format changes.

The **sensor rules** understand classification. Each rule creates an accumulator that receives readings one at a time and produces a result at the end. It changes when the quality criteria change.

```ts
export interface SensorAccumulator {
  addReading(value: number): void;
  classify(): Classification;
}

export interface SensorRule {
  createAccumulator(reference: number): SensorAccumulator;
}
```

The parser never knows what a thermometer is. A rule never sees a line of text. That boundary is what makes both the streaming and the extension story work.

```diagram
type: flow
title: How a log line becomes a classification
caption: The parser owns the format and the rules own the decision, so either can change without touching the other.
steps:
  - label: Chunk arrives
    detail: Text is pushed in pieces. Only the unfinished last line is carried over to the next chunk.
  - label: Parse the line
    detail: Reference line, sensor declaration, or reading. Anything else fails with its line number.
  - label: Route the reading
    detail: The value goes to the current sensor's accumulator. The line itself is discarded.
  - label: Accumulate
    detail: Thermometers keep a running mean and deviation. Humidity and CO keep one keep-or-discard flag.
  - label: Classify at the end
    detail: Each accumulator turns its fixed state into a result keyed by sensor name.
```

There is also a hard line around the library itself. Nothing in `src/` imports React or touches the DOM, and the library build compiles against the plain ES2023 type library, so reaching for `window` or `document` fails the build rather than a code review. The same code can run in a browser, in Node, or behind a service.

## Streaming with fixed state

"Very large" means the library cannot assume the log fits in memory. That rules out the afternoon version, which holds every reading for every sensor until the end.

The parser takes text in chunks through `push(chunk)` and `finish()`. Between chunks it keeps only the unfinished last line. `evaluateLogFile(string)`, the function the brief asked for, is just one `push` and one `finish`. `evaluateLogStream` feeds the same parser from a `ReadableStream<string>`.

The rules have to cooperate. Humidity and CO are easy: the sensor is discarded the moment any reading falls outside the tolerance, so the whole state is one boolean.

Thermometers need a mean and a standard deviation, and the textbook formula needs two passes, one for the mean and one for the deviations. Welford's algorithm does it in one pass with three numbers:

```ts
add(value: number): void {
  this.count += 1;
  const deviationFromPreviousMean = value - this.runningMean;
  this.runningMean += deviationFromPreviousMean / this.count;
  this.sumOfSquaredDeviations += deviationFromPreviousMean * (value - this.runningMean);
}
```

It is also numerically better behaved than keeping a sum and a sum of squares, which loses precision when readings are large and close together. A test compares it against a naive two-pass calculation so the shortcut is checked rather than trusted.

The result: memory grows with the number of sensors, not the number of readings.

## Chunk boundaries are where streaming parsers break

A streaming parser has a failure mode a whole-string parser cannot have: a chunk can end anywhere. In the middle of a number. Between a `\r` and its `\n`. Halfway through the word `thermometer`.

Writing a test for each case I could think of would miss the ones I could not. So the test does not think. It takes the sample log and splits it at every possible character position into two chunks, runs each pair through the stream, and checks the result is identical to parsing the whole string. It does this twice, once with LF line endings and once with CRLF.

That is a few hundred runs of a tiny input, it finishes instantly, and it covers every boundary at once.

## Fail loudly, with a line number

The other early decision was what to do with bad data. The forgiving option is to skip lines that do not parse. For this domain that is the wrong default.

A humidity sensor is discarded if any single reading is out of tolerance. If the parser silently skips a malformed reading, that might be the reading that would have discarded the unit. A skipped line does not just lose data, it can flip a quality decision and ship a sensor that should not ship.

So the parser stops at the first bad line and says where:

```text
Line 3: "hot" is not a number.
Line 9: Sensor "temp-1" was already declared on line 2.
Line 14: Unknown sensor type "noise". Expected one of: thermometer, humidity, monoxide.
```

The list of things that fail is deliberate and documented: a missing or short reference line, an unknown sensor type, a reading before any sensor, a non-numeric or infinite value, a duplicate sensor name, a sensor with no readings, a blank line in the middle, a line with the wrong number of fields.

Two less obvious ones:

- **Line length.** Real log lines are short, so anything over 1000 characters is bad data. The check runs on the unfinished line between chunks too, so a file with no newlines at all is rejected as soon as it passes the limit instead of filling memory while the parser waits for a line ending that never comes.
- **Sensor names like `__proto__`.** A name is any text without spaces. Sensors live in a `Map` during parsing, and the result is built with `Object.fromEntries`, so `__proto__` and `constructor` become ordinary own properties instead of reaching the prototype.

## Make the next sensor type cheap, and make forgetting it a compile error

The brief named the extension it expected: a noise level detector. I wanted that to be a one-line change for the common case, and a change the compiler would not let you half-finish.

```ts
export const sensorRules = {
  thermometer,
  humidity: everyReadingWithin(1),
  monoxide: everyReadingWithin(3),
  noise: everyReadingWithin(5),
} satisfies Record<SensorType, SensorRule>;
```

Adding `'noise'` to the `SensorType` union without adding a rule fails to compile, because of `satisfies`. Adding a rule without adding the type to the reference-line column order fails a test. A sensor with its own logic, like the thermometer, gets its own file that exports a `SensorRule`, and the parser does not change.

Building it this way also exposed a weakness in the log format itself. The reference line is positional: `reference 70.0 45.0 6`. The column order is the contract. Adding a noise detector means every log needs a fourth value, including logs from rooms with no noise sensors, and swapping two columns produces wrong results with no error.

The brief invited proposing format changes, so the README ends with the ones I would push for:

- **Named references**, such as `reference thermometer=70.0 humidity=45.0 monoxide=6`, so new types are additive and old logs stay valid.
- **Self-contained reading lines**, either with the sensor name on each reading or as JSON Lines. Today a reading only means something after everything above it has been read, so a large log cannot be split and processed in parallel.
- **Units in the header**, so a Celsius thermometer cannot be compared against a Fahrenheit reference without anyone noticing.

The code handles the format it was given. The writing argues for the format it should have.

## The demo stays thin

The brief asked for a library, so the React page exists to show the library in use and how I would build around it, not to be the product.

It reads the chosen file with `file.stream()` and passes it through `TextDecoderStream` into `evaluateLogStream`, so the page parses as bytes arrive, with no server and no worker. The stream reader uses `getReader()` rather than async iteration so it works in Node and every current browser, and it cancels the reader when parsing fails so the file is not read to the end for nothing.

One hook owns the work. Each run gets an `AbortController`. Starting a new run aborts the previous one, unmounting aborts the current one, and an aborted run never writes state. Choose a 400 MB file, change your mind and pick the sample, and the large file's result can never overwrite the small one's.

The accessibility basics are the same ones I would expect in production: a labelled native file input, a real table with a caption and header cells, a polite status region, an alert that names the file and the failing line, classification pills that always show the word so colour is only a supplement, and a spinner that stops under reduced motion. Playwright runs axe on both the success and the error state and completes the flow with the keyboard only.

## The bug I found after submitting

The tests passed. The design said memory was bounded by the number of sensors. I had not actually measured it on a file shaped like the one the brief warned about.

So after submitting, I generated one: 434 MB, 20,000 sensors, 20 million readings. I ran it with the heap capped at 48 MB.

It ran out of memory.

The cause was a V8 detail. When you take a substring of a long string, V8 can return a sliced string: a small view that points into the original instead of copying the characters. The parser split each chunk into lines and lines into fields, and the sensor name was one of those fields. Storing it as a `Map` key kept a reference to the slice, and the slice kept its entire 64 KB parent chunk alive. With short names V8 copies instead of slicing, which is why the sample log and the unit tests never showed it. Names longer than about 12 characters were slices, and 20,000 of them meant 20,000 chunks that could never be collected.

The fix is one line, forcing a real copy before the name is stored:

```ts
function copyString(text: string): string {
  return [...text].join("");
}
```

The regression test is the part I care about more. It enables garbage collection from inside the test, pushes 300 sensors with long names and 3,000 readings each, collects, and asserts the heap grew by less than 5 MB. Before the fix, it fails. After the fix, the 434 MB log runs comfortably in the 48 MB heap.

The lesson is not about V8 trivia. "Memory is bounded" was a claim about the design, and the design was right. The implementation leaked through a detail the design could not see. Only running the claim at the scale it was made for could tell the two apart.

## Where AI fit

The brief allowed AI and asked candidates to say how they used it, which I think is the right policy. I used an AI coding assistant throughout as a pair, not an author.

The decisions above were mine: streaming with fixed state, the rule and accumulator interface, failing on the first bad line, population standard deviation, inclusive "within", strict "under", the tolerance. I used the assistant for the parts where speed matters more than judgment: scaffolding Vite, Jest, Storybook, and Playwright; drafting boundary test cases, which I then checked against the brief by hand; demo CSS and contrast checks; first drafts of the README, which I rewrote; and generating the 434 MB stress log.

That last item is a good example of the split. Generating a large, realistic file is tedious and low risk, exactly the kind of work to hand off. Deciding that the claim needed testing at that size, and reading the heap failure correctly, was not.

## What I would take to the next library

1. List every ambiguity in the spec before writing code, pick an answer, write it down, and pin it with a boundary test.
2. Separate the code that understands the input format from the code that makes decisions.
3. Keep per-item state fixed size, and test streaming with every possible chunk split, not hand-picked ones.
4. When skipping bad data can change an outcome, fail with a line number instead.
5. Let the type system enforce the extension checklist, and argue for format changes in writing when the format is the real constraint.
6. Measure any performance or memory claim at the scale it was made for, then keep a regression test that would catch it again.

None of this is large. It is a few hundred lines of library code. But it is the difference between a function that produces the sample output and a library someone else can own.

## References

- [Welford's online algorithm](https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Welford's_online_algorithm): one-pass mean and variance.
- [MDN: Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) · [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream): reading a file as text chunks in the browser.
- [TypeScript: the `satisfies` operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator): checking an object against a type without widening it.
