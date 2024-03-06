# frozen_string_literal: true

RSpec.describe "Viewing the search banner", type: :system do
  fab!(:theme) { upload_theme_component }
  fab!(:topic)
  let(:topic_page) { PageObjects::Pages::Topic.new }

  it "should display the search banner below the site header when `plugin_outlet` theme setting is set to `below-site-header`" do
    theme.update_setting(:plugin_outlet, "below-site-header")
    theme.save!

    visit("/")

    expect(page).to have_css(".custom-search-banner")
    expect(page).to_not have_css("#main-outlet .custom-search-banner")
  end

  it "should display the search banner above the main container when `plugin_outlet` theme setting is set to `above-main-container`" do
    theme.update_setting(:plugin_outlet, "above-main-container")
    theme.save!

    visit("/")

    expect(page).to have_css("#main-outlet .custom-search-banner")
  end

  it "should display the search icon when searching within a topic when search button text is present" do
    theme.update_setting(:show_on, "all")
    theme.update_translation("search_banner.search_button_text", "Foo")
    theme.save!

    topic_page.visit_topic(topic)
    expect(topic_page).to have_css(".custom-search-banner")
    
    topic_page.find(".custom-search-banner input#search-term").fill_in(with: "test")
    topic_page.find(".custom-search-banner .results li:nth-child(2) a").click

    expect(topic_page).to have_css(".custom-search-banner .search-context")
    expect(topic_page).to have_css(".custom-search-banner .search-icon")
  end
end