import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<WatchState> buildReducer() {
  return asReducer(
    <Object, Reducer<WatchState>>{
      WatchAction.action: _onAction,
      WatchAction.updateDatabase: _onUpdateDatabase
    },
  );
}

WatchState _onAction(WatchState state, Action action) {
  final WatchState newState = state.clone();
  return newState;
}

WatchState _onUpdateDatabase(WatchState state, Action action) {
  final WatchState newState = state.clone();
  newState.databaseModel = action.payload;
  return newState;
}
