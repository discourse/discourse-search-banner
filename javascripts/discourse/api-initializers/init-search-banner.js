import { apiInitializer } from "discourse/lib/api";

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
    buildKey: function (attrs) {
      let type = attrs.formFactor || "menu";
      return `search-${type}`;
    },
    defaultState: function (attrs) {
      return {
        formFactor: attrs.formFactor || "menu",
        showHeaderResults: false,
      };
    },
    html: function () {
      if (this.state.formFactor === "widget") {
        return this.panelContents();
      } else {
        return this.attach("menu-panel", {
          maxWidth: 500,
          contents: () => this.panelContents(),
        });
      }
    },
    clickOutside() {
      if (!this.vnode.hooks["widget-mouse-down-outside"]) {
        return this.mouseDownOutside();
      }
    },
    mouseDownOutside() {
      const formFactor = this.state.formFactor;
      if (formFactor === "menu") {
        return this.sendWidgetAction("toggleSearchMenu");
      } else {
        this.state.showHeaderResults = false;
        this.scheduleRerender();
      }
    },
    click: function () {
      const formFactor = this.state.formFactor;
      if (formFactor === "widget") {
        this.showResults();
      }
    },
    showResults: function () {
      this.state.showHeaderResults = true;
      this.scheduleRerender();
    },
    linkClickedEvent: function () {
      const formFactor = this.state.formFactor;
      if (formFactor === "widget") {
        $("#search-term").val("");
        $(".search-placeholder").css("visibility", "visible");
        this.state.showHeaderResults = false;
        this.scheduleRerender();
      }
    },
    panelContents: function () {
      const formFactor = this.state.formFactor;
      let showHeaderResults =
        this.state.showHeaderResults == null ||
        this.state.showHeaderResults === true;
      let contents = [];

      if (formFactor === "widget") {
        contents.push(
          this.attach("button", {
            icon: "search",
            className: "search-icon",
            action: "showResults",
          })
        );
      }

      contents = contents.concat(...corePanelContents.call(this));
      let results = contents.find((w) => w.name == "search-menu-results");
      if (results && results.attrs.results) {
        $(".search-menu.search-header").addClass("has-results");
      } else {
        $(".search-menu.search-header").removeClass("has-results");
      }
      if (formFactor === "menu" || showHeaderResults) {
        return contents;
      } else {
        return contents.filter((widget) => {
          return (
            widget.name != "search-menu-results" &&
            widget.name != "search-context"
          );
        });
      }
    },
  });
  api.createWidget("search-widget", {
    tagName: "div.search-widget",
  });
  api.decorateWidget("search-widget:after", function (helper) {
    const searchWidget = helper.widget,
      appController = helper.register.lookup("controller:application"),
      searchMenuVisible = searchWidget.state.searchVisible;
    if (!searchMenuVisible && !searchWidget.attrs.topic) {
      return helper.attach("search-menu", {
        contextEnabled: searchWidget.state.contextEnabled,
        formFactor: "widget",
      });
    }
  });
});
