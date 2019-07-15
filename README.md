This is a component that puts a search bar along with optional headline and subhead text in a banner above the main topic list navigation of a Discourse community. 

By default this banner appears on all top-level topic pages (latest/new/unread/top/categories... anything in the `top menu` site setting) but it can also be set to only display on a community's homepage.

![17%20PM|690x326](https://d11a6trkgmumsb.cloudfront.net/optimized/3X/1/4/14ec7e5d17d7b8bd203759ce1c9b69605e2d9e03_2_1380x652.png) 


:building_construction: [Github repo](https://github.com/awesomerobot/discourse-search-banner): `https://github.com/awesomerobot/discourse-search-banner.git`

:telescope: [Preview it on theme creator](https://theme-creator.discourse.org/theme/awesomerobot/discourse-search-banner )

:question:  [How do I install a theme component?](https://meta.discourse.org/t/how-do-i-install-a-theme-or-theme-component/63682)


:sparkling_heart: This very heavily borrows from [angus'](https://github.com/angusmcleod) header search component: https://meta.discourse.org/t/header-search-theme/67959 


### Available settings

* Set the headline and subhead text
* Show the banner on all top-level topic pages (default), or just the homepage 
* Set a background image

### Custom styling

The HTML element gets a class named `.display-search-banner` wherever this banner appears, and the banner itself is wrapped with the `.custom-search-banner` class, so with some CSS you should be able to customize the appearance of this banner however you see fit.


### Future enhancements 

* Add an option to enable the banner in specific categories
