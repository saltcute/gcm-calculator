/**
 * A dirty workaround to disable all score validity checks in rg-stats.
 * Used so the calling code isn't needlessly complicated just to compute a rating
 * (e.g. a 101.0000% score without an ALL PERFECT+ lamp).
 *
 * rg-stats is a CommonJS package: every algorithm reads `ThrowIf` off the shared
 * `module.exports` object at call time. In this ESM file the named namespace
 * binding (`throwIf.ThrowIf`) is read-only and can't be reassigned — but the
 * module's *default* export IS that live `module.exports` object, which is a
 * plain, mutable object. Patching `ThrowIf` there makes every consumer pick up
 * the no-op. This is the ESM equivalent of
 * `require(".../throw-if").ThrowIf = ...` and works in both the browser and SSR
 * bundles (verified against esbuild code-splitting, which is what Vite's dep
 * optimizer uses).
 *
 * TODO: a better way to handle this???
 */

import * as throwIf from "rg-stats/js/util/throw-if";

const noop: typeof throwIf.ThrowIf = Object.assign(() => {}, {
    not: () => {},
    negative: () => {},
    positive: () => {},
    positiveOrZero: () => {},
    negativeOrZero: () => {},
    zero: () => {},
});

// The default export is the live CommonJS `module.exports` object (writable),
// unlike the read-only ES namespace binding above.
(
    throwIf as unknown as { default: { ThrowIf: typeof throwIf.ThrowIf } }
).default.ThrowIf = noop;
