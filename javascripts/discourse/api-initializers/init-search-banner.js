import { apiInitializer } from "discourse/lib/api";
import { logSearchLinkClick } from "discourse/lib/search";
import { iconNode } from "discourse-common/lib/icon-library";

export default apiInitializer("0.8", (api) => {
  const enableConnectorName = settings.plugin_outlet;
  const disableConnectorName =
    enableConnectorName === "above-main-container"
      ? "below-site-header"
      : "above-main-container";

  api.registerConnectorClass(disableConnectorName, "search-banner", {
    shouldRender() {
      return false;
    },
  });

  // Simplified version of header search theme component
  const searchMenuWidget = api.container.factoryFor("widget:search-menu");
  const corePanelContents = searchMenuWidget.class.prototype["panelContents"];

  api.reopenWidget("search-menu", {
    buildKey(attrs) {
      let type = attrs.formFactor || "menu";
      return `search-${type}`;
    },

    defaultState(attrs) {
      return {
        formFactor: attrs.formFactor || "menu",
        showHeaderResults: false,
        inTopicContext: attrs.inTopicContext,
      };
    },

    html(attrs, state) {
      if (this.state.formFactor === "widget") {
        return this.panelContents();
      } else {
        return this._super(attrs, state);
      }
    },

    clickOutside() {
      const formFactor = this.state.formFactor;
      if (formFactor === "menu") {
        return this.sendWidgetAction("toggleSearchMenu");
      } else {
        this.state.showHeaderResults = false;
        this.scheduleRerender();
      }
    },

    click() {
      const formFactor = this.state.formFactor;
      if (formFactor === "widget") {
        this.showResults();
      }
    },

    showResults() {
      this.state.showHeaderResults = true;
      this.scheduleRerender();
    },

    linkClickedEvent(attrs) {
      if (attrs) {
        const { searchLogId, searchResultId, searchResultType } = attrs;
        if (searchLogId && searchResultId && searchResultType) {
          logSearchLinkClick({
            searchLogId,
            searchResultId,
            searchResultType,
          });
        }
      }

      const formFactor = this.state.formFactor;

      if (formFactor === "widget") {
        this.state.showHeaderResults = false;
        this.scheduleRerender();
      }
    },

    focusSearchInput() {
      const searchInput =
        this.state.formFactor === "widget"
          ? document.querySelector(".search-widget #search-term")
          : document.querySelector(".search-menu #search-term");

      searchInput.focus();
      searchInput.select();
    },

    clearContext() {
      this.sendWidgetAction("clearSearch");
      this.sendWidgetAction("clearSearchWidgetContext");
      this.state.inTopicContext = false;
    },

    clearSearchWidgetContext() {
      this.state.inTopicContext = false;
    },

    panelContents() {
      const formFactor = this.state.formFactor;
      let showHeaderResults =
        this.state.showHeaderResults == null ||
        this.state.showHeaderResults === true;
      let contents = [];

      if (formFactor === "widget") {
        contents.push(
          this.attach("link", {
            href: this.fullSearchUrl({ expanded: true }),
            contents: () => iconNode("search"),
            className: "btn search-icon",
            title: "search.open_advanced",
          })
        );
      }

      contents = contents.concat(...corePanelContents.call(this));
      if (formFactor === "menu" || showHeaderResults) {
        return contents;
      } else {
        return contents.filter((widget) => {
          return (
            widget.name !== "search-menu-results" &&
            widget.name !== "search-context"
          );
        });
      }
    },
  });

  api.createWidget("search-widget", {
    tagName: "div.search-widget",

    html() {
      const searchMenuVisible = this.state.searchVisible;

      if (!searchMenuVisible && !this.attrs.topic) {
        return this.attach("search-menu", {
          contextEnabled: this.state.contextEnabled,
          formFactor: "widget",
        });
      }
    },

    clearSearchWidgetContext() {
      this.state.inTopicContext = false;
    },

    setTopicContext() {
      this.state.inTopicContext = true;
    },
  });
});
