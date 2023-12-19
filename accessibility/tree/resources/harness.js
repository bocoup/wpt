/**
 * Assert that ``actual`` is the same value as ``expected``.
 *
 * For objects this deeply compares that every member of ``expected`` is in
 * ``actual`` and are the same value. Keys in ``actual`` that are not in
 * ``expected`` are not compared.
 *
 * @param {Any} actual - Test value.
 * @param {Any} expected - Expected value.
 */
function assert_tree(actual, expected) {
    if (typeof expected === "object") {
        assert_equals(typeof actual, "object");
        for (const key in expected) {
            assert_own_property(actual, key);
            assert_tree(actual[key], expected[key]);
        }
    } else {
        assert_equals(actual, expected);
    }
}

/**
 * Test that the accessibility tree returned by test_driver matches the
 * expected value.
 *
 * @param {Any} expected - Expected value.
 */
function accessibility_tree_test(expected) {
    promise_test(async t => {
        assert_tree(await test_driver.get_accessibility_tree(), expected);
    });
}
