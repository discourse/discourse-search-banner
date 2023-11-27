import { apiInitializer } from "discourse/lib/api";
import { logSearchLinkClick } from "discourse/lib/search";
import { iconNode } from "discourse-common/lib/icon-library";
import { h } from "virtual-dom";
import I18n from "discourse-i18n";
import SearchBanner from "../components/search-banner";

export default apiInitializer("1.14.0", (api) => {
  api.renderInOutlet(
    settings.plugin_outlet === "above-main-container"
      ? "above-main-container"
      : "below-site-header",
    SearchBanner
  );
});
