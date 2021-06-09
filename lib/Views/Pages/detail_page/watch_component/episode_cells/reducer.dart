import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<EpisodeCellState> buildReducer() {
  return asReducer(
    <Object, Reducer<EpisodeCellState>>{
      EpisodeCellAction.action: _onAction,
    },
  );
}

EpisodeCellState _onAction(EpisodeCellState state, Action action) {
  final EpisodeCellState newState = state.clone();
  return newState;
}
