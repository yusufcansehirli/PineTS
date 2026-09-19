# Pine Script v6 — Known Gaps

Snapshot of the remaining, deliberate gaps after the v6 full-integration pass.
Reference measurement: the official Pine v6 documentation example corpus (424 examples) → 421 pass.

## 1. Hosted-data `request.*` methods are `na` stubs

`request.currency_rate`, `request.dividends`, `request.earnings`, `request.economic`,
`request.financial`, `request.footprint`, `request.quandl`, `request.seed`, `request.splits`

These return `na` and emit a one-time warning. Scripts compile and run; the values are empty
because the hosted data source is not available in this runtime. Closing this requires wiring a
data provider per method.

## 2. `import` needs a registered library

`import user/lib/1 [as alias]` transpiles and runs; the host must register resolved exports via
`PineTS.setLibraries({ 'user/lib/1': exports })`. Any unregistered library raises a clear error
on first use (by design — a declaration alone never fails).

## 3. Full-suite parallel-run flakiness (pre-existing, not an engine regression)

A single full `vitest run` can show a rotating set of 6–10 failures under parallel load; every
failing file passes in isolation, and the same behaviour reproduces on the pre-change baseline
(verified via `git stash`). Treat isolated runs + the corpus as the reference signal.
Note: `tests/_local/breaker-run.test.ts` also fails on the baseline (left-hand-side postfix
expression) — pre-existing, unrelated.

## 4. Corpus leftovers (3/424 — none are engine bugs)

- `controls:switch` — the documentation example is placeholder text, not valid Pine.
- `functions:polyline.new` — the documentation example is truncated mid-statement (line 38).
- `controls:import` — no library is registered by design (see §2).

## 5. Coverage-doc debt (cleared in this pass)

`docs/api-coverage/pinescript-v6/*.json` stale entries (str.split/substring/format_time,
max_bars_back, syminfo.ticker/prefix, ask/bid, library(), strategy()) and the
`docs/lang-coverage.md` rows (loops/conditionals/methods/objects/imports) were updated to
reflect the current implementation.
