import 'package:fish_redux/fish_redux.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';

import 'action.dart';
import 'state.dart';

Effect<SearchState> buildEffect() {
  return combineEffects(<Object, Effect<SearchState>>{
    SearchAction.action: _onAction,
    SearchAction.displayFilter: _displayFilter,
    SearchAction.search: _onSearch,
  });
}

void _onAction(Action action, Context<SearchState> ctx) {}

void _onSearch(Action action, Context<SearchState> ctx) async {
  ctx.dispatch(SearchActionCreator.setLoading(true));
  final _genres = ctx.state.enabledGenres;
  final _tags = ctx.state.enabledTags;
  final _season = ctx.state.enabledSeason;
  final _year = ctx.state.year;
  final _search = ctx.state.query;

  AnilistAPI()
      .getSearchResults(_genres, _tags, _search, _year, _season)
      .then((value) => ctx.dispatch(SearchActionCreator.setResults(value)))
      .whenComplete(() => ctx.dispatch(SearchActionCreator.setLoading(false)));
}

void _displayFilter(Action action, Context<SearchState> ctx) {}
