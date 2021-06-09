import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<BadeCellsState> buildReducer() {
  return asReducer(
    <Object, Reducer<BadeCellsState>>{
      BadeCellsAction.action: _onAction,
    },
  );
}

BadeCellsState _onAction(BadeCellsState state, Action action) {
  final BadeCellsState newState = state.clone();
  return newState;
}
