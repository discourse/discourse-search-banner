import Component from "@glimmer/component";
import I18n from "discourse-i18n";
import SearchIcon from "../../components/search-icon";
import not from "truth-helpers/helpers/not";

export default class SearchIconBeforeTerm extends Component {
  get searchButtonText() {
    return I18n.t(themePrefix("search_banner.search_button_text"));
  }

  <template>
    {{#if (not this.searchButtonText)}}
      <SearchIcon />
    {{/if}}
  </template>
}
