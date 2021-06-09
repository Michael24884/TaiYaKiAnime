import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<AnimeListState> buildReducer() {
  return asReducer(
    <Object, Reducer<AnimeListState>>{
      AnimeListAction.action: _onAction,
    },
  );
}

AnimeListState _onAction(AnimeListState state, Action action) {
  final AnimeListState newState = state.clone();
  return newState;
}
