import { action, computed } from "@ember/object";
import { and } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { defaultHomepage } from "discourse/lib/utilities";

export default class SearchBanner extends Component {
  @service router;
  @service siteSettings;
  @service currentUser;

  @and("displayForUser", "displayForRoute") shouldDisplay;

  @computed("router.currentRouteName")
  get displayForRoute() {
    const showOn = settings.show_on;
    const currentRouteName = this.router.currentRouteName;

    if (showOn === "homepage") {
      return currentRouteName === `discovery.${defaultHomepage()}`;
    } else if (showOn === "top_menu") {
      return this.siteSettings.top_menu
        .split("|")
        .any((m) => `discovery.${m}` === currentRouteName);
    } else if (showOn === "discovery") {
      return currentRouteName.startsWith("discovery.");
    } else {
      // "all"
      return (
        currentRouteName !== "full-page-search" &&
        !currentRouteName.startsWith("admin.")
      );
    }
  }

  @computed("currentUser")
  get displayForUser() {
    const showFor = settings.show_for;
    return (
      showFor === "everyone" ||
      (showFor === "logged_out" && !this.currentUser) ||
      (showFor === "logged_in" && this.currentUser)
    );
  }

  @action
  didInsert() {
    // Setting a class on <html> from a component is not great
    // but we need it for backwards compatibility
    document.documentElement.classList.add("display-search-banner");
  }

  @action
  willDestroy() {
    document.documentElement.classList.remove("display-search-banner");
  }
}
