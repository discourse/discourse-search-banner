# frozen_string_literal: true

RSpec.describe "Viewing the search banner", type: :system do
  fab!(:theme) { upload_theme_component }

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
end