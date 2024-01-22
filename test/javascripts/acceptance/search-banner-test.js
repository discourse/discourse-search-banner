import { click, fillIn, triggerKeyEvent, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance, query } from "discourse/tests/helpers/qunit-helpers";

acceptance("Discourse Search Banner", function (needs) {
  needs.user({ admin: true, experimental_search_menu_groups_enabled: true });

  test("Search Banner is present", async function (assert) {
    await visit("/");
    assert.dom(".custom-search-banner input#search-term").exists();
  });

  test("is only present on intended routes", async function (assert) {
    await visit("/admin");
    assert.dom(".custom-search-banner").doesNotExist();
  });

  test("it closes the search menu when clicking outside", async function (assert) {
    await visit("/");
    await click(".custom-search-banner input#search-term");
    await fillIn(".custom-search-banner input#search-term", "test");
    assert.dom(".custom-search-banner .results").exists();

    // select a element to simulate clicking outside the search banner
    await click(".custom-search-banner h1");
    assert.dom(".custom-search-banner .results").doesNotExist();
  });

  test("pressing escape closes the search menu", async function (assert) {
    await visit("/");
    await click(".custom-search-banner input#search-term");
    await fillIn(".custom-search-banner input#search-term", "test");
    assert.dom(".custom-search-banner .results").exists();

    await triggerKeyEvent(
      ".custom-search-banner #search-term",
      "keydown",
      "Escape"
    );
    assert.dom(".custom-search-banner .results").doesNotExist();
  });

  test("searching for a term in the search menu fills in the search banner search input", async function (assert) {
    await visit("/");
    await click("#search-button");
    await fillIn("#search-term", "test");
    assert
      .dom(".custom-search-banner input#search-term")
      .hasValue("test", "search inputs have matching terms");
  });

  test("you can navigate search results with the keyboard", async function (assert) {
    const container = ".custom-search-banner .results";

    await visit("/");
    await click(".custom-search-banner input#search-term");
    await fillIn(".custom-search-banner input#search-term", "test");

    await triggerKeyEvent(
      ".custom-search-banner #search-term",
      "keyup",
      "Enter"
    );
    assert.dom(`${container} .search-result-topic`).exists("has topic results");

    await triggerKeyEvent(document.activeElement, "keyup", "ArrowDown");
    assert.strictEqual(
      document.activeElement.getAttribute("href"),
      query(`${container} li:first-child a`).getAttribute("href"),
      "arrow down selects first element"
    );
  });
});
