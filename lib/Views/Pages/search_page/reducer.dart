import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<SearchState> buildReducer() {
  return asReducer(
    <Object, Reducer<SearchState>>{
      SearchAction.action: _onAction,
      SearchAction.setQuery: _setQuery,
      SearchAction.setResults: _setResults,
      SearchAction.setIsLoading: _setIsLoading,
    },
  );
}

SearchState _onAction(SearchState state, Action action) {
  final SearchState newState = state.clone();
  return newState;
}

SearchState _setIsLoading(SearchState state, Action action) {
  final SearchState newState = state.clone();
  newState.isLoading = action.payload;
  return newState;
}

SearchState _setResults(SearchState state, Action action) {
  final SearchState newState = state.clone();
  newState.results = action.payload;
  return newState;
}

SearchState _setQuery(SearchState state, Action action) {
  final SearchState newState = state.clone();
  newState.query = action.payload;
  return newState;
}
