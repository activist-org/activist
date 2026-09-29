// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Scores one catalog row against the spec inventory.
 *
 *   covered  a spec path matches, and a `test()` title matches when required
 *   partial  the matching tests are all skip/fixme
 *   missing  no spec path matches (no_spec), or no title matches (title_miss)
 */

function testTitlesOf(tests) {
  return [...new Set(tests.map((t) => t.title))];
}

export function evaluateCase(testcase, specFiles) {
  const matched = specFiles.filter((s) =>
    testcase.spec.some((frag) => s.file.includes(frag))
  );
  if (matched.length === 0) {
    return {
      ...testcase,
      status: "missing",
      reason: "no_spec",
      specs: [],
      testTitles: [],
    };
  }

  if (testcase.title) {
    const re = new RegExp(testcase.title, "i");
    const tests = matched.flatMap((s) =>
      s.tests
        .filter((t) => re.test(t.title))
        .map((t) => ({ ...t, file: s.file }))
    );
    if (tests.length === 0) {
      return {
        ...testcase,
        status: "missing",
        reason: "title_miss",
        specs: matched.map((s) => s.file),
        testTitles: [],
      };
    }
    const active = tests.filter((t) => !t.skipped);
    return {
      ...testcase,
      status: active.length === 0 ? "partial" : "covered",
      specs: [...new Set(tests.map((t) => t.file))],
      testTitles: testTitlesOf(active.length ? active : tests),
    };
  }

  const tests = matched.flatMap((s) =>
    s.tests.map((t) => ({ ...t, file: s.file }))
  );
  const allSkipped = matched.every(
    (s) => s.testCount > 0 && s.skippedCount === s.testCount
  );
  const active = tests.filter((t) => !t.skipped);
  return {
    ...testcase,
    status: allSkipped ? "partial" : "covered",
    specs: matched.map((s) => s.file),
    testTitles: testTitlesOf(active.length ? active : tests),
  };
}
