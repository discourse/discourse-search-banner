import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import I18n from "discourse-i18n";

export default class SearchBanner extends Component {
  @service router;
  @service siteSettings;
  @service currentUser;

  @action
  willDestroy() {
    super.willDestroy(...arguments);
    document.documentElement.classList.remove("display-search-banner");
  }

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

  get displayForUser() {
    const showFor = settings.show_for;
    return (
      showFor === "everyone" ||
      (showFor === "logged_out" && !this.currentUser) ||
      (showFor === "logged_in" && this.currentUser)
    );
  }

  get buttonText() {
    const buttonText = I18n.t(themePrefix("search_banner.search_button_text"));
    // this is required for when the English (US) locale is empty
    // and the site locale is set to another language
    // otherwise the English (US) fallback key is rendered as the button text
    // https://meta.discourse.org/t/bug-with-search-banner-search-button-text-shown-in-search-banner-theme-component/273628
    if (buttonText.includes("theme_translations")) {
      return false;
    }

    return buttonText;
  }

  get shouldDisplay() {
    return this.displayForRoute && this.displayForUser;
  }

  @action
  didInsert() {
    // Setting a class on <html> from a component is not great
    // but we need it for backwards compatibility
    document.documentElement.classList.add("display-search-banner");
  }
}
