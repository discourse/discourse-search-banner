import { addGlobalNotice } from "discourse/components/global-notice";
import { apiInitializer } from "discourse/lib/api";
import getURL from "discourse/lib/get-url";
import SearchBanner from "../components/search-banner";

export default apiInitializer((api) => {
  api.renderInOutlet(
    settings.plugin_outlet === "above-main-container"
      ? "above-main-container"
      : "below-site-header",
    SearchBanner
  );

  api.forceDropdownForMenuPanels("search-menu-panel");

  if (api.getCurrentUser()?.admin) {
    const themeId = themePrefix("foo").match(
      /theme_translations\.(\d+)\.foo/
    )[1];
    const themeURL = getURL(`/admin/customize/themes/${themeId}`);
    addGlobalNotice(
      `<b>Admin notice:</b> you're using the <em>Advanced Search Banner</em> theme component. This functionality is replaced now with the "welcome banner" functionality in Discourse core. You should <a href="${themeURL}">remove this theme component</a>, and see <a href="https://meta.discourse.org/t/creating-a-banner-to-display-at-the-top-of-your-site/153718" target="_blank">creating a banner to display at the top of your site on Discourse Meta</a> for instructions on how to replace it.`,
      "advanced-search-banner-deprecation",
      {
        dismissable: true,
        level: "warn",
        dismissDuration: moment.duration("1", "hour"),
      }
    );
  }
});
