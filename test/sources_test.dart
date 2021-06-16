import 'package:flutter_test/flutter_test.dart';
import 'package:taiyaki/Services/Sources/Base.dart';
import 'package:taiyaki/Services/Sources/Gogoanime.dart';

final String _searchQuery = 'Kono Subarashii Sekai ni Shukufuku wo!';

late SourceBase base;

void main() async {
  //IMPORTANT
  //Input your custom made Source here;
  setUp(() => base = new GogoAnime());

  test('Should return a search result', () async {
    final List<SourceSearchResultsModel> _searchResults =
        await base.getSearchResults(_searchQuery);
    if (_searchResults.isEmpty)
      fail(
          'No results were returned from the search query. You could try a custom anime title, if its a new website and doesnt contain the popular anime mentioned above');

    final _isValidLink = _searchResults.isNotEmpty &&
        _searchResults.first.link is String &&
        (_searchResults.first.link).startsWith('http');

    expect(_isValidLink, true);
    print('PASSED SEARCH TEST');
  });

  test('Should return a list of all episodes', () async {
    //Must replace with a proper episode link you can use one from the source through the website itself
    final String episodeLink =
        'https://www1.gogoanime.ai/category/kono-subarashii-sekai-ni-shukufuku-wo-';
    final episodes = await base.getEpisodeLinks(episodeLink);

    expect(episodes.length, greaterThanOrEqualTo(1));

    final bool _isValid = episodes.isNotEmpty &&
        episodes.first is String &&
        episodes.first.length > 0;
    expect(_isValid, true);

    print('PASSED EPISODE LINKS TEST');
  });

  test('Should return at least one host on the corresponding source', () async {
    //Must replace with a proper episode link you can use one from the source through the website itself
    final String episodeLink =
        'https://www1.gogoanime.ai/kono-subarashii-sekai-ni-shukufuku-wo--episode-1';

    final _hosts = await base.getEpisodeHosts(episodeLink);
    expect(_hosts.length, greaterThan(0));
    final _isValidHost = _hosts.first.host.length > 0 &&
        _hosts.first.hostLink is String &&
        _hosts.first.hostLink.startsWith('http');
    expect(_isValidHost, true);
    print(_hosts.first.hostLink);
    print('PASSED HOSTS TEST');
  });
}
