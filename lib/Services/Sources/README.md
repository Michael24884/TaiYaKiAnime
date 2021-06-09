# Taiyaki Sources

---

## Requirements for this Section

* IDE of any choice.
* Basic HTML knowledge. This is required for scraping links and other data off the source you are building for.

Sources are an important part of the Taiyaki app, as it connects the watching algorithm to the detail part of the application.

Fortuneately, Taiyaki makes it easy to get started on creating a cutom source. Simply implement SourceBase with any IDE(Visual Studios, Android Studios, etc.) of your choice, and finish the rest on your own.

```dart

class KissAnime implements SourceBase {
    ...
}

```

The IDE should auto fill out the necessary functions to override. If not just hit
    " alt + . "
(on Android Studios).

There is a total of 5(five) functions and 4(four) variables that require overriding.

```dart
///Function responsible for searching the anime on the source directly.
/// Query is the direct search term (default is the anime title) and can be customized by the user in case the title is different on the source.
///

Future<List<SourceSearchResultsModel>> getSearchResults(String query);
```

```dart
///Responsible for getting all available links. Ex 2 Episodes. It is critical that this returns links, if necessary filter out links that are null. 
///You only ned to return the links, Taiyaki will do the rest of the work(adding episode desc, thumbnails, etc.)
///The link param is obtained from the previous function getSearchResults. This is automatically passed in for you, but in development you need to provide a manual one directly from the website you are working on.

Future<List<String>> getEpisodeLinks(String link);
```

```dart
///Responsible for finding hosts. Hosts are also extendible and are created the same way Sources are, except with their own requirements. 
///Check the README in Hosts/ for more info
///
//Required for getting servers to watch the episodes on.

  Future<List<SourceEpisodeHostsModel>> getEpisodeHosts(String episodeLink);

```

```dart
///Required for fetching the amount of new episodes. Used by the Notification Handler. 
///Because this is the same as fetching episodes, you can use the getEpisodeLinks function instead and return length.
  Future<List<SourceEpisodeHostsModel>> getEpisodeHosts(String episodeLink);

```

Variables include: (may change in the future)

```dart
  //Name of the source
  String get name;
  //Is the site protected by Cloudflare?
  bool get usesCloudflare;
  //Basic http requests. Set up the base url, special headers, or anything internet related here
  Dio get request;
  //Misc info(author, assets, etc. This updates often)
  SourceInfo get info;
```

For a complete example checkout the GogoAnime under Sources/
