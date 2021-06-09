import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<HistoryState> buildReducer() {
  return asReducer(
    <Object, Reducer<HistoryState>>{
      HistoryAction.action: _onAction,
      HistoryAction.init: _onInit,
    },
  );
}

HistoryState _onAction(HistoryState state, Action action) {
  final HistoryState newState = state.clone();
  return newState;
}

HistoryState _onInit(HistoryState state, Action action) {
  final HistoryState newState = state.clone();
  newState.historyItems = action.payload;
  return newState;
}
