import Component from "@glimmer/component";
import DButton from "discourse/components/d-button";
import I18n from "discourse-i18n";

export default class SearchIcon extends Component {
  get buttonText() {
    return I18n.t(themePrefix("search_banner.search_button_text"));
  }

  get buttonClass() {
    return this.buttonText
      ? "btn search-icon has-search-button-text"
      : "btn search-icon";
  }

  <template>
    <DButton
      @icon="search"
      @translatedLabel={{this.buttonText}}
      @title="search.open_advanced"
      class={{this.buttonClass}}
      @href={{@outletArgs.advancedSearchButtonHref}}
    />
  </template>
}
