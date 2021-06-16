import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';

//TODO replace with your own action
enum SearchAction {
  action,
  displayFilter,
  search,
  setQuery,
  setResults,
  setIsLoading
}

class SearchActionCreator {
  static Action onAction() {
    return const Action(SearchAction.action);
  }

  static Action setLoading(bool isLoading) {
    return Action(SearchAction.setIsLoading, payload: isLoading);
  }

  static Action setQuery(String query) {
    return Action(SearchAction.setQuery, payload: query);
  }

  static Action setResults(List<AnilistNode> results) {
    return Action(SearchAction.setResults, payload: results);
  }

  static Action onSearch() {
    return const Action(SearchAction.search);
  }

  static Action displayFilter() {
    return const Action(SearchAction.displayFilter);
  }
}
