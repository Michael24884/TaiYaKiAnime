import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<FilterSheetState> buildReducer() {
  return asReducer(
    <Object, Reducer<FilterSheetState>>{
      FilterSheetAction.action: _onAction,
      FilterSheetAction.setFilterGenres: _onFilterGenre,
      FilterSheetAction.setFilterTags: _onFilterTag,
      FilterSheetAction.setFilterSeason: _onFilterSeason,
      FilterSheetAction.setYear: _onSetYear,
    },
  );
}

FilterSheetState _onAction(FilterSheetState state, Action action) {
  final FilterSheetState newState = state.clone();
  return newState;
}

FilterSheetState _onSetYear(FilterSheetState state, Action action) {
  final FilterSheetState newState = state.clone();
  final int? year = action.payload;
  newState.year = year;
  return newState;
}

FilterSheetState _onFilterSeason(FilterSheetState state, Action action) {
  final FilterSheetState newState = state.clone();
  final String _season = action.payload;
  newState.enabledSeason = _season;
  return newState;
}

FilterSheetState _onFilterGenre(FilterSheetState state, Action action) {
  final FilterSheetState newState = state.clone();
  final String _genre = action.payload;
  if (_genre == 'All')
    newState.enabledGenres = [];
  else {
    if (state.enabledGenres.contains(_genre))
      newState.enabledGenres =
          state.enabledGenres.where((element) => element != _genre).toList();
    else
      newState.enabledGenres.add(_genre);
  }

  return newState;
}

FilterSheetState _onFilterTag(FilterSheetState state, Action action) {
  final FilterSheetState newState = state.clone();
  final String _tag = action.payload;
  if (_tag == 'All')
    newState.enabledTags = [];
  else {
    if (state.enabledTags.contains(_tag))
      newState.enabledTags =
          state.enabledTags.where((element) => element != _tag).toList();
    else
      newState.enabledTags.add(_tag);
  }

  return newState;
}
