# Plaza (feed example)

A social feed built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/feed](https://m3ui.dev/examples/feed).

## Structure

```
feed/
├── PlazaExample.vue         MNavigationSuite (bar, rail, expanded rail), the page, side panel, composer, stories
├── usePlaza.ts              navigation, posts, timeline + new posts, likes / reposts / bookmarks / votes, follows,
│                            replies, publishing, notifications, stories
├── data.ts                  people, the endless post generator, replies, trends, stories, notifications
├── art.ts                   photos drawn as SVG (landscapes, cities, beaches, food, abstract) and banners
├── views/
│   ├── HomeView.vue         For you / Following (MTabs), stories, MPullToRefresh + MInfiniteScroll, "new posts" pill
│   ├── ExploreView.vue      search (Top / People / Media), trending chips, an endless MMasonry photo wall
│   ├── NotificationsView.vue likes, reposts, follows, replies and mentions, unread until you leave
│   ├── BookmarksView.vue    posts you saved
│   ├── ProfileView.vue      banner, bio, counts, Follow (MToggleButton), Posts / Media / Likes
│   └── PostView.vue         one post with the post it answers and its replies
└── components/
    ├── PostCard.vue         author, text, photos or poll, actions (reply, repost, like, views, bookmark, share), menu
    ├── RichText.vue         #hashtags and @mentions as links
    ├── PostPhotos.vue       1–4 photo layouts, MLightbox, double-tap to like with a popping heart
    ├── PollView.vue         vote, then animated result bars
    ├── Composer.vue         MDialog: text with a character ring (MCircleProgressBar), photos, poll, MEmojiButton
    ├── StoriesRow.vue       ringed avatars; StoryViewer.vue shows them full screen with MProgressBar segments
    ├── SidePanel.vue        search, trending and who to follow (large screens)
    └── AppHeader.vue        each page's sticky header
```

## How it works

- **Posts are generated** from a number (`makePost(n)` in `data.ts`): an author, text from their topics, and sometimes
  photos or a poll. The timeline asks for the next numbers whenever `MInfiniteScroll` reaches the end, so it never runs out.
- **New posts arrive** every half minute and wait behind the "new posts" pill; pulling down (`MPullToRefresh`) fetches one
  and shows them all.
- **Your posts and replies** go to the top of the timeline (or under the post), and a few seconds later someone likes
  them: you get a notification and a toast. Photos you attach stay in the browser (object URLs).
- **Stories** advance every 5 seconds; tap the left third to go back, the rest to go forward, hold to pause.
- **Layout**: `MNavigationSuite` picks a bottom bar, a rail or (on large screens) an expanded rail with the compose FAB;
  the feed is a centered column, with search, trends and suggestions beside it on large screens. Home stays alive
  (`KeepAlive`) and keeps its scroll while you visit other pages.
