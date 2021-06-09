import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<AnimeListCellState> buildReducer() {
  return asReducer(
    <Object, Reducer<AnimeListCellState>>{
      AnimeListCellAction.action: _onAction,
    },
  );
}

AnimeListCellState _onAction(AnimeListCellState state, Action action) {
  final AnimeListCellState newState = state.clone();
  return newState;
}
