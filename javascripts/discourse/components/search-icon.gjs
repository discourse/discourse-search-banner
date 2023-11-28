import Component from "@glimmer/component";
import DButton from "discourse/components/d-button";
import concatClass from "discourse/helpers/concat-class";

export default class SearchIcon extends Component {
  get advancedSearchButtonHref() {
    return "/search?expanded=true";
  }

  <template>
    <DButton
      @icon="search"
      @translatedLabel={{@buttonText}}
      @title="search.open_advanced"
      class={{concatClass "btn search-icon" @buttonClass}}
      @href={{this.advancedSearchButtonHref}}
    />
  </template>
}
