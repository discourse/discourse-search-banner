import { apiInitializer } from "discourse/lib/api";
import SearchBanner from "../components/search-banner";

export default apiInitializer((api) => {
  api.renderInOutlet(
    settings.plugin_outlet === "above-main-container"
      ? "above-main-container"
      : "below-site-header",
    SearchBanner
  );

  api.forceDropdownForMenuPanels("search-menu-panel");
});
