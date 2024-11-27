# Flaky test detection utility
Done as challenge for NSWI126 - Pokročilé nástroje pro vývoj a monitorování software

## Setup

Setup is a standard React+TypeScript project using Jest as test suite.

The suite has three files:
- `goodTest` that always passes
- `failingTest` that always fails
- `flakyTest` that is flaky (uses non-seeded random number generator that has a bug)


## Utility

The actual flaky test detection utility is in the [flaky-util](flaky-util) folder.

It contains `reporter` used to get data from the testing framework Jest and a `run` file that is the core of the actual utility.

The utility works by running the test suite and checking the result.
If the first run was successful, it exits early (to speed up most common case in CI).

If, however, there was any failure, the whole suite is re-run two more times.
The results are aggregated and results of tests are compared on test-by-test basis. If results across runs differ, the test is marked as flaky.
Finally, the utility reports flaky tests (or flaky suites - suites that have different amount of test across runs).

## Possible continuation

It might be possible to get location of the tet from Jest (but I am encountering a bug in Jest, that makes this harder at the moment).
From there the test file could be parsed, the relevant code found and fed into ChatGPT with a prompt to explain potentially problematic parts.
Alternatively other forms of static analysis could be performed (such as tracing the calls and detecting known-problematic calls).
