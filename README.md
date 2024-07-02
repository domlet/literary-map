# Literary Map of the United States

See the [live map](https://domlet.github.io/literary-map). _(Project temporarily suspended to avoid tileset hosting costs from Mapbox.)_

![](img/literary-map-demo-500px.gif)

## Poster from 3 Fish Studios

Sometime around 2020 I walked into [Green Apple Books](https://www.greenapplebooks.com/) in San Francisco and purchased a charming color poster titled _Literary Map of the United States_ (ISBN: 9780991171095) by the designers at [3 Fish Studios](https://www.3fishstudios.com/). I was so enchanted (partly because structured data is one of my love languages) that I bought the poster for my niece, and now when I visit my sister's house I always see it on the wall. ❤️

## My adaptation

With the goals of practicing my JavaScript, reflecting on the historiography embedded in this collection of titles, and deepening my knowledge of U.S. history, I set about making a web map version of this poster. I envisioned an interactive map that users could access on a web or mobile client, where they could click on states to reveal the [suggested book titles](https://www.goodreads.com/review/list/25373-dom) – and then explore or actually access these titles (as e-books or audiobooks).

### Structuring the data

To achieve this vision, I first manually [recreated the data set](https://docs.google.com/spreadsheets/d/1kcxMgFJvpx5HScnQBdH8BzgavMmKPC0hCttOQx20IN0/edit?gid=1752591852#gid=1752591852) (`states`, `titles`, `authors`) in Google Sheets so I could structure batch queries to acquire the spatial, multimedia, and URL data I needed to build the map and make it interactive.

First, I needed **spatial data** to visualize the map, and offer pop-ups when users clicked on one of the states:

- **Polygon** (shape file) for each state.
- **Centerpoint** (latitude and longitude coordinates) for each state.

  *Note: I don't remember where I got the spatial values (open data), but because the source also included ratification dates, I became more curious about territories that were not ratified as states. This prompted me to begin reading [*How to Hide an Empire: A History of the Greater United States*](https://www.goodreads.com/book/show/40121985-how-to-hide-an-empire) by Daniel Immerwahr (ISBN: 9780374172145).*

Next, I needed **style data** to make the interactive map echo the whimsical visual style of the original, so I created a [Mapbox map style](https://api.mapbox.com/styles/v1/domlet/clqx1hpcj000k01rc3ihn75lf.html?title=view&access_token=pk.eyJ1IjoiZG9tbGV0IiwiYSI6ImNsanp3a24xeDAxMjMzZGxpeDY3MWZpMXkifQ.4TIVDbum8xmIdzokCod3Ww&zoomwheel=true&fresh=true#4.11/46.79/-120.65) using two of the main visual elements:

- **Color value** (ie, pink, purple, green) for each state.
- **Font** (Dancing Script Regular).

Lastly, I needed **metadata for the titles**, to enable pop-ups with a cover image and description for each book. If you need to do this, you can use the [Google Books API](https://developers.google.com/books):

- Cover images:

```
curl -o 'Beloved.jpg' 'http://books.google.com/books/content?id=ppfYf0K6fcoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
```

- Other data, returned as a JSON object:

```
{
 title: 'The Book Of Unknown Americas',
author: 'Cristina Henríquez',
state: 'Delaware'
},
```

Then, because I like to access **free audiobooks** from the San Francisco Public Library, I created a batch of queries so a user can see if such a resource is available for any given title. Here's an example query for _The Book Of Unknown Americas_:

```
open https://sfpl.bibliocommons.com/v2/search?query=The%20Book%20Of%20Unknown%20Americas
```

### Technology stack

- JavaScript / jQuery
- Mapbox GL JS
- Google Books API
- Google Sheets, using handy formulas like [TRIM](https://www.google.com/search?q=google+sheets+formula+TRIM), [RIGHT](https://www.google.com/search?q=google+sheets+formula+RIGHT), [SUBSTITUTE](https://www.google.com/search?q=google+sheets+formula+SUBSTITUTE), [REPT](https://www.google.com/search?q=google+sheets+formula+REPT), [LEN](https://www.google.com/search?q=google+sheets+formula+LEN), [LEN](https://www.google.com/search?q=google+sheets+formula+LEN), [CONCATENATE](https://www.google.com/search?q=google+sheets+formula+CONCATENATE), and [REGEXREPLACE](https://www.google.com/search?q=google+sheets+formula+REGEXREPLACE).
- [ChatGPT](https://chatgpt.com/) (to get unstuck).

## Future steps

### Phase 1

Well, because I created a tileset with too small a resolution (I wanted to give users the ability to explore the map at pretty high zoom levels), I ended up racking up some Mapbox bills that I had to pay, so after 6 months I just deleted my U.S. tileset and broke the map. So here's my to-do list:

1. **Modify and restore** the primary tileset.
2. **Add U.S. territories** to make the colonial history less obscure:
3. _When I Was Puerto Rican_ (Puerto Rico)
4. _Leaves of the Banyan Tree_ (American Samoa)
5. _Land of Love and Drowning_ (Virgin Islands)

### Phase 2

Now that the structure exists for an interactive literary map, I could add a feature to curate completely different collections of U.S.-themed books – such as LGBTQ+ fiction, science fiction, Spanish-language fiction, narratives of colonial resistance, lesser-known inventors, or anything really. Each collection could have its own map style, [changing the appearance of the map](https://docs.mapbox.com/mapbox-gl-js/example/style-switch/) when a new collection is selected for display.

To add a whole new layer of interactivity, I could add a panel with all the book titles from the collection, and users could check boxes for all the titles they have read. The map could visualize the user's list on the map to reveal the geographic aspect of their past reading, to reveal bias (such as a New York/California coastal bias, or a bias towards the southwest, American South, or the U.S.-Mexico border region).

### Phase 3

After sharing all my human labor in an open source repository that will be harvested by AI so that corporations can profit from robots who mined the gems of guilless humans... I envision that I will suffer from wage stagnation and a shortage of employment opportunities, combined with a vicious ideology that blames individuals for being poor while hyping the brilliance of those who read the technological forecast and have sufficient privilege to access opportunities for marshalling monetary investment from the super-rich, which will pay said wages for said scarce opportunties whose technical labor will create (for private profit) the transformative technologies of the future, which unfortunately many will not see due to the lack of affordable healthcare which [results in the premature death and bankrupcy of ordinary people under technological capitalism](https://podcasts.apple.com/us/podcast/nicole-chung-carrying-memories-alone/id1643163707?i=1000641948106). _Adding that to my to-do list._
