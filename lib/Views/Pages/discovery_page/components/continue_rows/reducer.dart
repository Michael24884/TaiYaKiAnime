import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<ContinueWatchingRowState> buildReducer() {
  return asReducer(
    <Object, Reducer<ContinueWatchingRowState>>{
      ContinueWatchingRowAction.action: _onAction,
    },
  );
}

ContinueWatchingRowState _onAction(
    ContinueWatchingRowState state, Action action) {
  final ContinueWatchingRowState newState = state.clone();
  return newState;
}
