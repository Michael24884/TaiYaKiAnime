import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/cupertino.dart';
import 'package:taiyaki/Models/Anilist/typed_models.dart';
import 'package:taiyaki/Views/Pages/search_page/state.dart';

class FilterSheetState implements Cloneable<FilterSheetState> {
  List<String> enabledGenres = [];
  String enabledSeason = 'ALL';
  List<String> enabledTags = [];
  int? year;

  @override
  FilterSheetState clone() {
    return FilterSheetState()
      ..year = year
      ..enabledGenres = enabledGenres
      ..enabledSeason = enabledSeason
      ..enabledTags = enabledTags;
  }
}

class FilterSheetConnector extends ConnOp<SearchState, FilterSheetState> {
  @override
  FilterSheetState get(SearchState state) {
    final subState = FilterSheetState().clone();
    subState.enabledGenres = state.enabledGenres;
    subState.enabledSeason = state.enabledSeason;
    subState.enabledTags = state.enabledTags;
    subState.year = state.year;
    return subState;
  }

  @override
  void set(SearchState state, FilterSheetState subState) {
    state.enabledGenres = subState.enabledGenres;
    state.year = subState.year;
    state.enabledSeason = subState.enabledSeason;
    state.enabledTags = subState.enabledTags;
  }
}
